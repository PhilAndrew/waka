import React from 'react'
import Columns from 'react-columns'


import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { View, Text } from 'react-native-web'

import { withRouter } from 'react-router'
import {vars} from '../../styles'


let styles = null


styles = StyleSheet.create({
  wrapper: {
    paddingLeft: '20px',
    paddingRight: '20px',
    textShadow: '2px 2px #000000',
    backgroundColor: '#ffffff',
    height: '100%',
    color: '#fff',
    backgroundImage: 'url(/photos/background4.jpg)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  dashboard: {
    paddingLeft: '20px',
    paddingRight: '20px',
    backgroundColor: '#ffffff',
    height: '100%',
  },
  red: {
    paddingLeft: 'auto',
  },
})


class BasemapWithoutRouter extends React.Component {
 
  componentDidMount() {
  }

  render() {
    console.log(this.props.location.pathname)
    if (this.props.location.pathname === '/dashboard') {


      return <View style={styles.dashboard}><Text>
        Dashboard contents
        </Text>
      </View>
    } else {
      return <View style={styles.wrapper}><Text>
        <h2 style={[styles.hd]}>"There can be no equal justice where the kind of trial a man gets depends on the amount
          of money he has."
          – Hugo Black, U.S. Supreme Court Justice
        </h2>
        <div>
          <Columns columns="3">
            <Text style={styles.red}>
              <h2>250<br/>cases matched</h2>
            </Text>
            <Text>
              <h2>800<br/>NGOs served</h2>
            </Text>
            <Text>
              <h2>600<br/>law firms</h2>
            </Text>
          </Columns>
        </div>

      </Text></View>
    }
  }




}



/*
,
  direction: {
    paddingTop: vars.padding,
    paddingLeft: vars.padding,
    paddingBottom: vars.padding * 0.5,
    fontWeight: '600',
    fontSize: vars.defaultFontSize,
    fontFamily: vars.defaultFontFamily,
  },
  linkWrapper: {
    padding: vars.padding,
  },
  error: {
    padding: vars.padding,
  },
  errorMessage: {
    fontSize: vars.defaultFontSize,
    fontFamily: vars.defaultFontFamily,
  }
 */

const Basemap = withRouter(BasemapWithoutRouter)
export { Basemap }
