import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { View, Text, TextInput, StyleSheet, findNodeHandle } from 'react-native'
import { StationStore } from '../../stores/stationStore.js'
import { UiStore } from '../../stores/uiStore.js'
import { t } from '../../stores/translationStore.js'
import { LinkButton } from '../reusable/linkButton.jsx'

import { TouchableOpacity } from '../reusable/touchableOpacity.jsx'

import LinesIcon from '../../../dist/icons/lines.svg'
import PinIcon from '../../../dist/icons/pin.svg'
import MultiIcon from '../../../dist/icons/multi.svg'
import TrainIcon from '../../../dist/icons/train.svg'
import FerryIcon from '../../../dist/icons/ferry.svg'
import BusIcon from '../../../dist/icons/bus.svg'
import CablecarIcon from '../../../dist/icons/cablecar.svg'
import ATIcon from '../../../dist/icons/at.svg'
import MetlinkIcon from '../../../dist/icons/metlink.svg'
import DymajoIcon from '../../../dist/icons/dymajo.svg'
import PatronIcon from '../../../dist/icons/patron.svg'
import CityIcon from '../../../dist/icons/city.svg'
import SettingsIcon from '../../../dist/icons/settings.svg'
import {vars} from '../../styles'

const iconMap = {
  'lines.svg': <LinesIcon />,
  'pin.svg': <PinIcon />,
  'multi.svg': <MultiIcon />,
  'train.svg': <TrainIcon />,
  'ferry.svg': <FerryIcon />,
  'cablecar.svg': <CablecarIcon />,
  'bus.svg': <BusIcon />,
  'at.svg': <ATIcon />,
  'metlink.svg': <MetlinkIcon />,
  'dymajo.svg': <DymajoIcon />,
  'patron.svg': <PatronIcon />,
  'city.svg': <CityIcon />,
  'settings.svg': <SettingsIcon />,
}

let styles = null


class SidebarItemVanilla extends React.Component {
  state = {
    description: false,
  }
  static propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    type: PropTypes.string,
    action: PropTypes.func,
    url: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.node,
    description2: PropTypes.node,
    history: PropTypes.object,
  }
  getIcon(icon) {
    return iconMap[icon] || <img src={`/icons/normal/${icon}`} />
  }
  triggerTap = () => {
    if (this.props.type === 'install') {
      this.props.action()
    } else if (this.props.type === 'url') {
      window.open(this.props.url)
    } else {
      if (this.props.url === '/l/') {
        return this.props.action()
      }
      this.props.history.push(this.props.url)
    }
  }
  reject(e) {
    if (UiStore.state.mapView) {
      e.preventDefault()
    }
  }
  toggleDescription = () => {
    this.setState({
      description: !this.state.description,
    })
  }
  render() {
    let classname = (this.props.className || '') + ' ss'
    if (window.location.pathname == this.props.url) {
      classname += ' selected'
    }
    let item = (
      <TouchableOpacity
        iOSHacks={true}
        opacity={75}
        className={'touchable ' + classname}
        onClick={this.triggerTap}
      >
        <div className="icon">{this.getIcon(this.props.icon)}</div>
        <div className="text-wrapper">
          <h3 className="name">{this.props.name}</h3>
          <div className="description">{this.props.description}</div>
        </div>
      </TouchableOpacity>
    )

    if (this.props.type === 'description') {
      let label = 'Read More'
      let className = 'description2'
      if (this.state.description) {
        className += ' show'
        label = 'Close'
      }
      return (
        <li className={classname + ' text-only touchable'}>
          <div className="text-wrapper">
            <h1 className="name">{this.props.name}</h1>
            <div className="description">{this.props.description}</div>
            <div className={className}>{this.props.description2}</div>
            <button
              className="transparent-button"
              onClick={this.toggleDescription}
            >
              {label}
            </button>
          </div>
        </li>
      )
    }
    else if (this.props.type === 'description2') {
      let label = 'Read More'
      let className = 'description2'
      if (this.state.description) {
        className += ' show'
        label = 'Close'
      }
      return (
        <li className={classname + ' text-only touchable'}>
          <div className="text-wrapper">
            <h1 className="name">{this.props.name}</h1>
            <div className="description">{this.props.description}</div>
            <div className={className}>{this.props.description2}</div>
            <button
              className="transparent-button"
              onClick={this.toggleDescription}
            >
            </button>
          </div>
        </li>
      )
    }
    return item
  }
}
const SidebarItem = withRouter(SidebarItemVanilla)

export class RootContent extends React.Component {
  static propTypes = {
    pin: PropTypes.func,
  }
  state = {
    input1: StationStore.input1Value,
    stations: StationStore.getData(),
    currentCity: StationStore.currentCity,
  }
  triggerUpdate = () => {
    this.setState({
      stations: StationStore.getData(),
    })
  }
  toggleRegion() {
    UiStore.safePush('/region')
  }
  componentDidMount() {
    StationStore.bind('change', this.triggerUpdate)
    StationStore.bind('newcity', this.newcity)
  }
  componentWillUnmount() {
    StationStore.unbind('change', this.triggerUpdate)
    StationStore.unbind('newcity', this.newcity)
  }
  newcity = () => {
    this.setState({
      currentCity: StationStore.currentCity,
    })
  }
  reject(e) {
    if (UiStore.state.mapView) {
      e.preventDefault()
    }
  }
  clickLogin = () => {
    //UiStore.go('/dashboard')
    console.log('clicked')
    UiStore.safePush('/dashboard/law')
  }
  render() {
    let twitterAcc
    if (this.state.currentCity.prefix === 'nz-akl') {
      twitterAcc = (
        <SidebarItem
          type="url"
          url="https://twitter.com/AklTransport"
          icon="at.svg"
          name="Auckland Transport"
          description={t('serviceAlerts.twitter', { account: 'AklTransport' })}
        />
      )
    } else if (this.state.currentCity.prefix === 'nz-wlg') {
      twitterAcc = (
        <SidebarItem
          type="url"
          url="https://twitter.com/metlinkwgtn"
          icon="metlink.svg"
          name="Metlink"
          description={t('serviceAlerts.twitter', { account: 'metlinkwgtn' })}
        />
      )
    }

    let stations = this.state.stations
    const secondTwo = [

    ]
    const description2 = (
      <div>
        <h3>Why the name Waka?</h3>
        <p>
          The word waka in te reo Māori encompasses transport and vehicles, and
          we chose this name as a acknowledgment of our country, Aotearoa New
          Zealand.
        </p>
        <p>
          We acknowledge the tangata whenua and the ongoing struggles Māori have
          in actively participating in the Māori language and culture. We would
          like to do our bit to support Te Reo as an official language of
          Aotearoa, and provide improved access for Māori communities.
        </p>
        <p>Kia Ora.</p>
        <h3>What’s new in the latest version?</h3>
        <p>
          Version 2.3 is exciting. There’s now a new interface which gives you
          access to the map at all times. We’ve also fixed a lot of bugs,
          especially on iOS. Lastly, we’ve improved the lines view, allowing you
          to see all the stops at once.
        </p>
        <p>
          We’re all ready for the central new network in Auckland and Wellington
          too.
        </p>
        <p>We hope you enjoy Waka 2.3!</p>
      </div>
    )
    const onboarding = (
      <div className="onboard blue-fill">
        <ul>

          <View style={styles.innerWrapper}>
            <Text style={styles.label}>Your email:
            </Text>
            <TextInput
              style={styles.input}
              value={this.state.email}
              onChange={this.triggerSaveChange}
            />
            <Text style={styles.label}>Password:
            </Text>
            <TextInput
              style={styles.input}
              value={this.state.email}
              secureTextEntry={true}
              onChange={this.triggerSaveChange}
            />
            <LinkButton
              color="secondary"
              size="large"
              label="Login User"
              onClick={this.clickLogin}
            />
          </View>


          <SidebarItem
            type="install"
            action={this.props.togglePin}
            icon="pin.svg"
            name={t('onboarding.install.name')}
            description={
              <div>
                <span>
                  {t('onboarding.install.description', {
                    appname: t('app.name'),
                  })}
                </span>
                <span>
                  {t('onboarding.install.description2', {
                    appname: t('app.name'),
                  })}
                </span>
              </div>
            }
          />

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

        </ul>
      </div>
    )

    let message
    if (StationStore.getOrder().length === 0) {
      message = (
        <h6>
          {t('savedStations.empty')}
          <br />
          {t('savedStations.empty2')}
        </h6>
      )
    }

    // positions the onboarding thing dependent on pwa mode.
    return (
      <div className="root-card-content">
        {onboarding}

        <br />
        <br />
        <br />
        <br />
        <br />

      </div>
    )
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
