const colors = require('colors')
const sql = require('mssql')
const connection = require('../db/connection.js')
const Storage = require('../db/storage.js')

const search = require('../stops/search.js')
const cache = require('../cache.js')
const config = require('../../config.js')
const log = require('../../server-common/logger.js')
const cityMetadata = require('../../cityMetadata.json')
const StopsDataAccess = require('../stops/dataAccess.js')

let lineData = {}
cache.preReady.push(() => {
  try {
    const lineDataSource = require(`./regions/${global.config.prefix}.js`)

    // the second element in the array is default, if it is not exported from the source
    const requiredProps = [
      ['lineColors', {}],
      ['lineIcons', {}],
      ['friendlyNames', {}],
      ['friendlyNumbers', {}],
      ['lineGroups', []],
      ['allLines', {}],
      ['lineOperators', {}],
    ]
    requiredProps.forEach(prop => {
      if (lineDataSource.hasOwnProperty(prop[0])) {
        lineData[prop[0]] = lineDataSource[prop[0]]
      } else {
        lineData[prop[0]] = prop[1]
      }
    })
  } catch (err) {
    log(('Could not load line data for ' + global.config.prefix).red)
    console.error(err)
  }
})

const storageSvc = new Storage({
  backing: config.storageService,
  local: config.emulatedStorage,
  region: config.shapesRegion,
})
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
})

const stopsDataAccess = new StopsDataAccess()
const line = {
  getColor(agency_id, route_short_name) {
    if (lineData.getColor) {
      return lineData.getColor(agency_id, route_short_name)
    } else if (lineData.lineColors) {
      return lineData.lineColors[route_short_name] || '#00263A'
    }
    return '#00263A'
  },
  getIcon(agency_id, route_short_name) {
    // this will probably be revised soon
    if (lineData.lineIcons) {
      return lineData.lineIcons[route_short_name] || null
    }
    return null
  },
  /**
   * @api {get} /:region/lines List - All
   * @apiName GetLines
   * @apiGroup Lines
   *
   * @apiParam {String} region Region of Worker
   *
   * @apiSuccess {Object} meta Region metadata
   * @apiSuccess {String} meta.prefix Region Prefix
   * @apiSuccess {String} meta.name Name of the Region
   * @apiSuccess {String} meta.secondaryName Extra Region Name (State, Country etc)
   * @apiSuccess {String} meta.longName The name and secondary name combined.
   * @apiSuccess {Object[]} friendlyNames Key value store of Route Short Names to more official names
   * @apiSuccess {Object[]} colors Key value store of Route Short Names to corresponding colors
   * @apiSuccess {Object[]} icons Key value store of Route Short Names to corresponding icons (optional)
   * @apiSuccess {Object[]} groups Grouping for all the lines into region.
   * @apiSuccess {String} groups.name Name of Group
   * @apiSuccess {String[]} groups.items Route Short Names that belong in the group
   * @apiSuccess {Object[]} lines List of all lines
   * @apiSuccess {String[]} lines.line Can have more than one item - depends on how many route variants.
   * For each variant: 0th Element - Origin (or full name if length 1), 1st Element - Destination. 2nd Element - Via.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "meta": {
   *         "prefix": "nz-akl",
   *         "name": "Tāmaki Makaurau",
   *         "secondaryName": "Auckland"
   *         "longName": "Tāmaki Makaurau, Auckland"
   *       },
   *       "friendlyNames": {
   *         "380": "Airporter"
   *       },
   *       "colors": {
   *         "380": "#2196F3"
   *       },
   *       "icons": {
   *         "380": "nz/at-metro-airporter"
   *       },
   *       "groups": [
   *         {
   *           "name": "Congestion Free Network",
   *           "items": [
   *             "380"
   *           ]
   *         }
   *       ],
   *       "lines": {
   *         "380": [
   *           [
   *             "Onehunga",
   *             "Manukau",
   *             "Airport"
   *           ],
   *           [
   *             "Howick",
   *             "Pukekohe",
   *             "Airport"
   *           ]
   *         ]
   *       }
   *     }
   *
   */
  getLines(req, res) {
    res.send(line._getLines())
  },
  _getLines() {
    let city = cityMetadata[global.config.prefix]
    // if the region has multiple cities
    if (!city.hasOwnProperty('name')) {
      city = city[global.config.prefix]
    }
    return {
      meta: {
        prefix: global.config.prefix,
        name: cityMetadata[global.config.prefix].name,
        secondaryName: cityMetadata[global.config.prefix].secondaryName,
        longName: cityMetadata[global.config.prefix].longName,
      },
      colors: lineData.lineColors,
      icons: lineData.lineIcons,
      friendlyNames: lineData.friendlyNames,
      friendlyNumbers: lineData.friendlyNumbers,
      groups: lineData.lineGroups,
      lines: lineData.allLines,
      operators: lineData.lineOperators,
    }
  },
  /**
   * @api {get} /:region/line/:line Info - by route_short_name
   * @apiName GetLine
   * @apiGroup Lines
   *
   * @apiParam {String} region Region of Worker
   * @apiParam {String} line route_short_name of particular line
   *
   * @apiSuccess {Object[]} line All the variants for a particular line.
   * @apiSuccess {String} line.route_id GTFS route_id
   * @apiSuccess {String} line.route_long_name Long name for route variant
   * @apiSuccess {String} line.route_short_name Short name for route variant
   * @apiSuccess {String} line.route_color Color for route
   * @apiSuccess {String} line.route_icon Icon for route (optional)
   * @apiSuccess {Number} line.direction_id Direction of route
   * @apiSuccess {String} line.shape_id GTFS Shape_id
   * @apiSuccess {Number} line.route_type GTFS route_type - Transport mode
   *
   * @apiSuccessExample Success-Response:
   * HTTP/1.1 200 OK
   * [
   *   {
   *     "route_id": "50140-20171113160906_v60.12",
   *     "route_long_name": "Britomart Train Station to Manukau Train Station",
   *     "route_short_name": "EAST",
   *     "route_color": "#f39c12",
   *     "route_icon": "nz/at-metro-eastern",
   *     "direction_id": 1,
   *     "shape_id": "1199-20171113160906_v60.12",
   *     "route_type": 2
   *   },
   *   {
   *     "route_id": "50151-20171113160906_v60.12",
   *     "route_long_name": "Manukau Train Station to Britomart Train Station",
   *     "route_short_name": "EAST",
   *     "route_color": "#f39c12",
   *     "route_icon": "nz/at-metro-eastern",
   *     "direction_id": 0,
   *     "shape_id": "1198-20171113160906_v60.12",
   *     "route_type": 2
   *   }
   * ]
   */
  async getLine(req, res) {
    const lineId = req.params.line.trim()
    try {
      const data = await line._getLine(lineId)
      res.send(data)
    } catch (err) {
      res.status(500).send(err)
    }
  },
  async _getLine(lineId) {
    const sqlRequest = connection.get().request()

    // filter by agency if a filter exists
    let agency = ''
    if (lineData.agencyFilter) {
      const agencyId = lineData.agencyFilter(lineId)
      if (agencyId !== null) {
        lineId = lineId.replace(agencyId, '')
        agency = 'and routes.agency_id = @agency_id'
        sqlRequest.input('agency_id', sql.VarChar(50), agencyId)
      }
    }
    sqlRequest.input('route_short_name', sql.VarChar(50), lineId)

    const query = `
      SELECT 
        routes.route_id,
        routes.agency_id,
        routes.route_short_name,
        routes.route_long_name,
        routes.route_type,
        trips.shape_id,
        trips.trip_headsign,
        trips.direction_id,
        count(trips.shape_id) as shape_score
      FROM routes
          LEFT JOIN trips on 
          trips.route_id = routes.route_id
      WHERE 
          routes.route_short_name = @route_short_name
          ${agency}
      GROUP BY
        routes.route_id,
        routes.agency_id,
        routes.route_short_name,
        routes.route_long_name,
        routes.route_type,
        trips.shape_id,
        trips.trip_headsign,
        trips.direction_id
      ORDER BY
        shape_score desc`

    const result = await sqlRequest.query(query)
    const versions = {}
    const results = []
    result.recordset.forEach(function(route) {
      // checks to make it's the right route (the whole exception thing)
      if (line.exceptionCheck(route) === false) {
        return
      }
      // make sure it's not already in the response
      if (
        typeof versions[route.route_long_name + (route.direction_id || '0')] ===
        'undefined'
      ) {
        versions[route.route_long_name + (route.direction_id || '0')] = true
      } else {
        return
      }

      let result = {
        route_id: route.route_id,
        route_long_name: route.route_long_name,
        route_short_name: route.route_short_name,
        route_color: line.getColor(route.agency_id, route.route_short_name),
        route_icon: line.getIcon(route.agency_id, route.route_short_name),
        direction_id: route.direction_id,
        shape_id: route.shape_id,
        route_type: route.route_type,
      }
      // if it's the best match, inserts at the front
      if (line.exceptionCheck(route, true) === true) {
        return results.unshift(result)
      }
      results.push(result)
    })
    if (results.length === 2) {
      if (results[0].route_long_name === results[1].route_long_name) {
        let candidate = results[1]
        if (results[0].direction_id !== 1) {
          candidate = results[0]
        }
        let regexed = candidate.route_long_name.match(/\((.+?)\)/g)
        if (regexed) {
          const newName =
            '(' +
            regexed[0]
              .slice(1, -1)
              .split(' - ')
              .reverse()
              .join(' - ') +
            ')'
          candidate.route_long_name = candidate.route_long_name.replace(
            /\((.+?)\)/g,
            newName
          )
        } else {
          candidate.route_long_name = candidate.route_long_name
            .split(' - ')
            .reverse()
            .join(' - ')
        }
      }
    }
    return results
  },
  /**
   * @api {get} /:region/shapejson/:shape_id Line Shape - by shape_id
   * @apiName GetShape
   * @apiGroup Lines
   *
   * @apiParam {String} region Region of Worker
   * @apiParam {String} shape_id GTFS Shape_id for particular shape.
   *
   * @apiSuccess {String} type GeoJSON Shape Type
   * @apiSuccess {Object[]} coordinates GeoJSON Coordinates
   *
   * @apiSuccessExample Success-Response:
   * HTTP/1.1 200 OK
   * {
   *   "type": "LineString",
   *   "coordinates": [
   *     [
   *         174.76848,
   *         -36.84429
   *     ],
   *     [
   *         174.76863,
   *         -36.84438
   *     ]
   *   ]
   * }
   */
  getShapeJSON(req, res) {
    const containerName = config.shapesContainer
    const prefix = global.config.prefix
    const version = global.config.version
    const shape_id = req.params.shape_id
    const fileName = 
      prefix + '/' +
      version.replace('_', '-').replace('.', '-') + '/' +
      Buffer.from(shape_id).toString('base64') + '.json'
    

    storageSvc.downloadStream(containerName, fileName, res, function(
      blobError
    ) {
      if (blobError) {
        res.status(404)
      }
      res.end()
      return
    })
  },

  exceptionCheck(route, bestMatchMode = false) {
    let allLines
    const prefix = global.config.prefix
    if (prefix === 'nz-akl' || prefix === 'nz-wlg') {
      allLines = lineData.allLines
    } else {
      return true
    }

    // blanket thing for no schools
    if (route.trip_headsign === 'Schools') {
      return false
    }
    if (typeof allLines[route.route_short_name] === 'undefined') {
      return true
    }
    let retval = false
    let routes = allLines[route.route_short_name].slice()

    // new mode that we only find the best match
    if (bestMatchMode) {
      routes = [routes[0]]
    }
    routes.forEach(function(variant) {
      if (variant.length === 1 && route.route_long_name === variant[0]) {
        retval = true
        // normal routes - from x to x
      } else if (variant.length === 2) {
        let splitName = route.route_long_name.toLowerCase().split(' to ')
        if (
          variant[0].toLowerCase() == splitName[0] &&
          variant[1].toLowerCase() == splitName[1]
        ) {
          retval = true
          // reverses the order
        } else if (
          variant[1].toLowerCase() == splitName[0] &&
          variant[0].toLowerCase() == splitName[1] &&
          !bestMatchMode
        ) {
          retval = true
        }
        // handles via Flyover or whatever
      } else if (variant.length === 3) {
        let splitName = route.route_long_name.toLowerCase().split(' to ')
        if (
          splitName.length > 1 &&
          splitName[1].split(' via ')[1] === variant[2].toLowerCase()
        ) {
          splitName[1] = splitName[1].split(' via ')[0]
          if (
            variant[0].toLowerCase() === splitName[0] &&
            variant[1].toLowerCase() === splitName[1]
          ) {
            retval = true
            // reverses the order
          } else if (
            variant[1].toLowerCase() === splitName[0] &&
            variant[0].toLowerCase() === splitName[1] &&
            !bestMatchMode
          ) {
            retval = true
          }
        }
      }
    })
    return retval
  },

  /**
   * @api {get} /:region/stops/trip/:trip_id Line Stops - by trip_id
   * @apiName GetStopsByTrip
   * @apiGroup Lines
   *
   * @apiParam {String} region Region of Worker
   * @apiParam {String} trip_id GTFS trip_id for particular trip
   *
   * @apiSuccess {Object[]} stops Array of stops
   *
   * @apiSuccessExample Success-Response:
   * HTTP/1.1 200 OK
   * [
   *   {
   *     "stop_id": "9218",
   *     "stop_name": "Manukau Train Station",
   *     "stop_lat": -36.99388,
   *     "stop_lon": 174.8774,
   *     "departure_time": "1970-01-01T18:00:00.000Z",
   *     "departure_time_24": false,
   *     "stop_sequence": 1
   *   }
   * ]
   */
  async getStopsFromTrip(req, res) {
    const sqlRequest = connection.get().request()
    sqlRequest.input('trip_id', sql.VarChar(100), req.params.trip_id)
    try {
      const result = await sqlRequest.query(`
        SELECT 
          stops.stop_code as stop_id,
          stops.stop_name,
          stops.stop_lat,
          stops.stop_lon,
          stop_times.departure_time,
          stop_times.departure_time_24,
          stop_times.stop_sequence
        FROM stop_times
        LEFT JOIN stops
          on stops.stop_id = stop_times.stop_id
        WHERE
          stop_times.trip_id = @trip_id
        ORDER BY stop_sequence`)

      const stopRoutes = await stopsDataAccess.getRoutesForMultipleStops(result.recordset.map(i => i.stop_id))
      res.send(search._stopsFilter(result.recordset.map(i => {
        const transfers = stopRoutes[i.stop_id].filter(j => j.trip_headsign !== 'Schools').map(j => j.route_short_name)
        const deduplicatedTransfers = Array.from(new Set(transfers).values())
        const transfersWithColors = deduplicatedTransfers.map(j => [j, line.getColor(null, j)])
        transfersWithColors.sort(collator.compare)
        i.transfers = transfersWithColors
        return i
      }), 'keep'))
    } catch (err) {
      console.error(err)
      res.status(500).send(err)
    }
  },
  /**
   * @api {get} /:region/stops/shape/:shape_id Line Stops - by shape_id
   * @apiName GetStopsByShape
   * @apiGroup Lines
   *
   * @apiParam {String} region Region of Worker
   * @apiParam {String} shape_id GTFS shape_id for particular trip
   *
   * @apiSuccess {Object[]} stops Array of stops
   *
   * @apiSuccessExample Success-Response:
   * HTTP/1.1 200 OK
   * [
   *   {
   *     "stop_id": "9218",
   *     "stop_name": "Manukau Train Station",
   *     "stop_lat": -36.99388,
   *     "stop_lon": 174.8774,
   *     "departure_time": "1970-01-01T18:00:00.000Z",
   *     "departure_time_24": false,
   *     "stop_sequence": 1
   *   }
   * ]
   */
  getStopsFromShape(req, res) {
    const sqlRequest = connection.get().request()
    sqlRequest.input('shape_id', sql.VarChar(100), req.params.shape_id)
    sqlRequest
      .query(
        'SELECT TOP(1) trip_id FROM trips WHERE trips.shape_id = @shape_id'
      )
      .then(result => {
        let trip_id = result.recordset[0].trip_id
        req.params.trip_id = trip_id
        line.getStopsFromTrip(req, res)
      })
  },
}

module.exports = line
