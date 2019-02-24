import React from 'react'
import Dropdown from 'react-dropdown'
import {TextInput, StyleSheet, findNodeHandle } from 'react-native'
import ReactTable from 'react-table'

import { Header } from '../reusable/header.jsx'
import { View, Text } from 'react-native-web'
import {vars} from '../../styles'

let styles = null

export class Dashboard extends React.PureComponent {


  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two', className: 'myOptionClassName' },
      {
        type: 'group', name: 'group1', items: [
          { value: 'three', label: 'Three', className: 'myOptionClassName' },
          { value: 'four', label: 'Four' }
        ],
      },
      {
        type: 'group', name: 'group2', items: [
          { value: 'five', label: 'Five' },
          { value: 'six', label: 'Six' }
        ],
      },
    ]
    return <View>
      <Header title=""/>
      <div className="root-card-content">
        <div className="onboard blue-fill">
          <ul>

            <View style={styles.innerWrapper2}>
              <Text><h2>Search Cases</h2>
              </Text>
            </View>
            <View style={styles.innerWrapper}>
              <Text style={styles.label}>Practice area:</Text>
              <TextInput
                style={styles.input}
                value=''
              />
              <Dropdown options={options}
                        placeholder="Select an option" />
            </View>


            <View style={styles.innerWrapper}>
              <Text style={styles.label}>Jurisdiction:
              </Text>
              <TextInput
                style={styles.input}
                value=''
              />
            </View>


            <View style={styles.innerWrapper}>
              <Text style={styles.label}>Priority:
              </Text>
              <TextInput
                style={styles.input}
                value=''
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
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
  },
  innerWrapper2: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 10,
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
