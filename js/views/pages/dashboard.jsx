import React from 'react'
import {TextInput, StyleSheet, findNodeHandle } from 'react-native'
import ReactTable from 'react-table'

import { Header } from '../reusable/header.jsx'
import { View, Text } from 'react-native-web'
import {vars} from '../../styles'

let styles = null

export class Dashboard extends React.PureComponent {
  render() {
      return <View>
        <Header title=""/>
        <div className="root-card-content">
          <div className="onboard blue-fill">
            <ul>

              <View style={styles.innerWrapper}>
                <Text><h2>Search Cases</h2>
                </Text>
              </View>

              <View style={styles.innerWrapper}>
                <Text style={styles.label}>Search field:
                </Text>
                <TextInput
                  style={styles.input}
                  value=''
                  onChange={this.triggerSaveChange}
                />
              </View>
            </ul>
          </div>
        </div>
      </View>

  }
}


styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  innerWrapper: {
    padding: vars.padding,
    backgroundColor: '#fff',
  },
  label: {
    color: vars.headerColor,
    fontFamily: vars.fontFamily,
    fontWeight: 'bold',
    fontSize: vars.defaultFontSize - 2,
    paddingBottom: vars.padding * 0.25,
  },
  input: {
    fontFamily: vars.fontFamily,
    fontSize: vars.defaultFontSize,
    backgroundColor: '#fff',
    paddingTop: vars.padding * 0.5,
    paddingBottom: vars.padding * 0.5,
    paddingLeft: vars.padding * 0.75,
    paddingRight: vars.padding * 0.75,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: vars.borderColor,
    borderRadius: 3,
    marginBottom: vars.padding,
  },
  checkboxContainer: {
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2,
  },
  checkboxRow: {
    paddingBottom: vars.padding / 2,
  },
})
