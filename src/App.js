import React from 'react'
import moment from 'moment'

import Settings from './Settings'
import Table from './Table'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    let settings = localStorage.getItem('ags:settings')
    settings = settings
      ? JSON.parse(settings)
      : ({
        numberOfTweets: 30,
        darkMode: false,
        positions: { '@makeschool': 0, '@newsycombinator': 1, '@ycombinator': 2 }
      })

    this.state = {
      makeschool: [],
      news: [],
      ycombinator: [],
      showSettings: false,
      settings
    }

    this.handleToggleSettings = this.handleToggleSettings.bind(this)
    this.handleSettingsChange = this.handleSettingsChange.bind(this)
    this.handleChangeOrder = this.handleChangeOrder.bind(this)
  }

  componentDidMount() {
    const l = document.location

    localStorage.setItem('ags:data', true)

    fetch(`${l.protocol}//${l.hostname}:7890/1.1/statuses/user_timeline.json?count=30&screen_name=makeschool`)
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('ags:makeschool', JSON.stringify(data))
        formatTwitterCreatedAt(data)
        this.setState({ makeschool: data })
      })
    fetch(`${l.protocol}//${l.hostname}:7890/1.1/statuses/user_timeline.json?count=30&screen_name=newsycombinator`)
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('ags:news', JSON.stringify(data))
        formatTwitterCreatedAt(data)
        this.setState({ news: data })
      })
    fetch(`${l.protocol}//${l.hostname}:7890/1.1/statuses/user_timeline.json?count=30&screen_name=ycombinator`)
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('ags:ycombinator', JSON.stringify(data))
        formatTwitterCreatedAt(data)
        this.setState({ ycombinator: data })
      })
  }

  componentDidUpdate(props, state) {
    const darkMode = this.state.settings.darkMode
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }

  handleToggleSettings() {
    this.setState({ showSettings: !this.state.showSettings })
  }

  handleSettingsChange(settings) {
    localStorage.setItem('ags:settings', JSON.stringify(settings))
    this.setState({ settings: { ...settings } })
  }

  handleChangeOrder(positions) {
    const settings = { ...this.state.settings }
    settings.positions = positions
    this.handleSettingsChange(settings)
  }

  render() {
    const number = this.state.settings.numberOfTweets - 1;
    const makeschool = this.state.makeschool.slice(0, number)
    const news = this.state.news.slice(0, number)
    const ycombinator = this.state.ycombinator.slice(0, number)

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between mb-4">
              <h1 className="d-inline-block">App</h1>
              <div className="settings-button d-inline-block">
                <button className="btn" onClick={this.handleToggleSettings}>⚙</button>
              </div>
            </div>
            {
              this.state.showSettings
                ? <Settings settings={this.state.settings} onChange={this.handleSettingsChange} />
                : <Table onChangeOrder={this.handleChangeOrder}
                  positions={this.state.settings.positions}
                  makeschool={[...makeschool]}
                  news={[...news]}
                  ycombinator={[...ycombinator]} />
            }
          </div>
        </div>
      </div>
    )
  }
}

function formatTwitterCreatedAt(tweets) {
  if (tweets) {
    tweets.forEach(tweet => {
      tweet.created_at = moment(tweet.created_at, "ddd MMM DD HH:mm:ss ZZ YYYY")
    })
  }
}