import React from 'react'
import Columns from 'react-columns'

import ReactTable from 'react-table'
import PropTypes from 'prop-types'
import { StyleSheet, TextInput } from 'react-native'
import { View, Text } from 'react-native-web'

import { withRouter } from 'react-router'
import {vars} from '../../styles'
import {UiStore} from '../../stores/uiStore'
import {StationStore} from '../../stores/stationStore'
//import {LinkButton} from '../reusable/linkButton'


let styles = null


styles = StyleSheet.create({
  red: {
    color: '#33ff33 !important',
  },
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
  innerWrapper: {
    padding: vars.padding,
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

class BasemapWithoutRouter extends React.Component {

  state = {
    email: '',
    data: [{
      id: 0,
      name: 'NGO needs assistance with reviewing licensing agreement.',
      status: 'open',
      action: 'Action',
    },
      {
        id: 1,
        name: 'NGO needs assistance with trademark registration.',
        status: 'open',
        action: 'Action',
        haveApplied: false,
      },
      {
        id: 2,
        name: 'Immigrant needs assistance with reviewing insurance agreement.',
        status: 'open',
        action: 'Action',
        haveApplied: false,
      },
      {
        id: 3,
        name: 'Environmental NGO seeks research assistance to summarise conservation laws across Asian jurisdictions for comparative analysis.',
        status: 'open',
        action: 'Action',
        haveApplied: false,
      }

    ]
  }

  componentDidMount() {
  }


  clickApply(e) {
    console.log(e);
    console.log('click apply')
    UiStore.safePush('/lawyer/apply')
  }

  onCancel(e) {
    UiStore.goBack()
  }

  render() {
    console.log(this.props.location.pathname)

    if (this.props.location.pathname === '/lawyer/apply') {
      return <View style={styles.dashboard}>
        <Text>
          <h2>Apply to case</h2>
          <View style={styles.innerWrapper}>
            <Text style={styles.label}>Application message:
            </Text>
            <TextInput
              multiline={true}
              style={styles.input}
            />
            <div>
              <button onClick={this.onCancel}>Submit</button>
              <br />&nbsp;<br />
              <button onClick={this.onCancel}>Cancel</button>
            </div>
          </View>

        </Text>
      </View>
    } else
    if (this.props.location.pathname === '/dashboard/law') {



      const columns = [{
        Header: 'Case Description',
        accessor: 'name', // String-based value accessors!
        style: {'white-space': 'unset'},
      },
      {
        Header: 'Status',
        accessor: 'status', // String-based value accessors!
        Cell: props => {
          const {
            value
          } = props;
          if (value === 'applied')
            return (
              <Text style={styles.red}>
                {value}
              </Text>
            )
          else
            return (
              <Text>
                {value}
              </Text>
            );
        }
        },
      {
        Header: 'Action',
        accessor: 'action', // String-based value accessors!
        Cell: props => <span className='number'>
            <button>Apply to case</button>
        </span>, // Custom cell components!
      }]

      /*
      , {
        Header: 'Age',
        accessor: 'age',
        Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
      }, {
        id: 'friendName', // Required because our accessor is not a string
        Header: 'Friend Name',
        accessor: d => d.friend.name, // Custom value accessors!
      }, {
        Header: props => <span>Friend Age</span>, // Custom header components!
        accessor: 'friend.age',
      }
       */
      return <View style={styles.dashboard}>
        <Text>
          <h2>Law firm Dashboard - All cases</h2>
        </Text>
        <ReactTable
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, handleOriginal) => {
                if (column.id === 'action')
                  this.clickApply()
                console.log("A Td Element was clicked!");
                console.log("it produced this event:", e);
                console.log("It was in this column:", column);
                console.log("It was in this row:", rowInfo);
                console.log(rowInfo.original.id);
                this.state.data[rowInfo.original.id].status = 'applied';
                this.state.data[rowInfo.original.id].haveApplied = true;
                this.setState(this.state);
                console.log("It was in this table instance:", instance);

                // IMPORTANT! React-Table uses onClick internally to trigger
                // events like expanding SubComponents and pivots.
                // By default a custom 'onClick' handler will override this functionality.
                // If you want to fire the original onClick handler, call the
                // 'handleOriginal' function.
                if (handleOriginal) {
                  handleOriginal();
                }
              }
            }}}
        data={this.state.data}
        columns={columns}
      />
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
