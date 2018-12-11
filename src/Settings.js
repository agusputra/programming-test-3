import React from 'react'

export default class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = props.settings
    this.handleChange = this.handleChange.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    return { ...props.settings }
  }

  handleChange(el) {
    const settings = { ...this.state };
    if (el.target.type === 'checkbox') {
      settings.darkMode = el.target.checked
    } else {
      settings.numberOfTweets = el.target.value
    }
    this.props.onChange(settings)
  }

  render() {
    return (
      <div>
        <h2>Settings</h2>
        <div className="card card-body">
          <div className="form-group">
            <label>Number of tweets</label>
            <select
              className="form-control"
              onChange={this.handleChange}
              value={this.state.numberOfTweets}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dark-mode">
              <input
                type="checkbox"
                id="dark-mode"
                className="mr-2"
                onChange={this.handleChange}
                checked={this.state.darkMode} />
              Dark mode?
            </label>
          </div>
        </div>
      </div>
    )
  }
}