import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, StyleSheet } from 'react-native'

import { vars } from '../../styles.js'
import { t } from '../../stores/translationStore.js'
import { UiStore } from '../../stores/uiStore.js'
import { LinkButton } from '../reusable/linkButton.jsx'
import { TouchableOpacity } from '../reusable/touchableOpacity.jsx'

let styles = null // defined down below

const Transfers = props => {
  const { transfers, currentLine } = props
  return transfers.length <= 1 ? null : (
    <View style={styles.transfers}>
      {transfers.filter(t => t[0] !== currentLine).map(transfer => (
        <Text
          style={[styles.transfer, { backgroundColor: transfer[1] }]}
          key={transfer[0]}
        >
          {transfer[0]}
        </Text>
      ))}
    </View>
  )
}

export class NgoStops extends React.PureComponent {
  static propTypes = {
    stops: PropTypes.array.isRequired,
    color: PropTypes.string.isRequired,
    line: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
  }

  triggerClick(stopCode, mode) {
    return () => {
      const { line, region } = this.props
      const baseUrl = `/s/${region}/${stopCode}`
      if (mode === 'timetable') {
        UiStore.safePush(`${baseUrl}/timetable/${line}-2`)
      } else {
        UiStore.safePush(baseUrl)
      }
    }
  }

  render() {
    const { color, stops, line } = this.props
    const stopStyle = [styles.stop, { borderColor: color }]
    const myStyle = styles.wrapper
    return (
      <View style={myStyle}>
        {stops.map((stop, index) => (
          <View style={stopStyle} key={stop.stop_sequence}>
            {index === 0 ? (
              <View style={styles.bulletWrapper}>
                <View style={styles.bulletFake} />
                <View style={styles.bulletSpacing} />
              </View>
            ) : index === stops.length - 1 ? (
              <View style={styles.bulletWrapper}>
                <View style={styles.bulletSpacing} />
                <View style={styles.bulletFake} />
              </View>
            ) : null}
            <View style={styles.bullet} />
            <View
              style={
                index === stops.length - 1
                  ? [styles.controls, { borderBottomWidth: 0 }]
                  : styles.controls
              }
            >
              <TouchableOpacity
                iOSHacks
                style={styles.touchable}
                onClick={this.triggerClick(stop.stop_id, 'services')}
              >
                <View style={styles.contentContainer}>
                  <Text style={styles.stopText}>{stop.stop_name}</Text>
                  <Transfers transfers={stop.transfers} currentLine={line} />
                </View>
              </TouchableOpacity>
              <LinkButton
                onClick={this.triggerClick(stop.stop_id, 'timetable')}
                color="secondary"
                size="small"
                label={t('vech_loc.timetable')}
              />
            </View>
          </View>
        ))}
      </View>
    )
  }
}

styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: vars.borderColor,
  },
  stop: {
    marginLeft: vars.padding,
    borderLeftWidth: 5,
    borderLeftStyle: 'solid',
    borderColor: '#666',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bulletWrapper: {
    flexDirection: 'column',
    marginLeft: -5,
  },
  bulletFake: {
    borderLeftWidth: 5,
    borderLeftStyle: 'solid',
    borderLeftColor: '#fff',
    flex: 1,
  },
  bullet: {
    borderTopWidth: 5,
    borderTopStyle: 'solid',
    borderTopColor: 'inherit',
    width: 10,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: vars.padding * 0.75,
    marginLeft: -5,
  },
  bulletSpacing: {
    flex: 1,
  },
  controls: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: vars.borderColorWhite,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: vars.padding,
  },
  touchable: {
    flex: 1,
    paddingRight: vars.padding,
  },
  contentContainer: {
    paddingBottom: vars.padding * 0.5,
  },
  stopText: {
    flex: 1,
    fontSize: vars.defaultFontSize - 1,
    fontFamily: vars.defaultFontFamily,
    paddingTop: vars.padding * 0.75,
    paddingBottom: vars.padding * 0.25,
  },
  transfers: {
    display: 'block',
    overflow: 'hidden',
    height: 24,
    marginBottom: vars.padding * 0.25,
  },
  transfer: {
    backgroundColor: '#222',
    color: '#fff',
    marginRight: 3,
    fontSize: vars.defaultFontSize - 2,
    fontFamily: vars.defaultFontFamily,
    fontWeight: '600',
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 1,
    paddingBottom: 2,
    borderRadius: '3px',
    display: 'inline-block',
  },
})
