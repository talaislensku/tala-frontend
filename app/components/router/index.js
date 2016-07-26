import React from 'react'
import { createHistory, useQueries } from 'history'

import Main from '../main'

class Router extends React.Component {
  constructor(props) {
    super(props)

    this.history = useQueries(createHistory)()

    this.state = {
      location: this.history.getCurrentLocation(),
    }
  }

  componentDidMount() {
    this.history.listen(location => {
      this.setState({ location })
    })
  }

  getQuery = () =>
    this.history && decodeURIComponent(this.history.getCurrentLocation().pathname.replace('/', ''))

  updateRoute = (pathname, params = {}) => {
    this.history.replace({
      pathname,
      query: params,
    })
  }

  render() {
    const { location } = this.state

    return (
      <Main
        query={this.getQuery()}
        params={location.query}
        updateRoute={this.updateRoute}
      />
    )
  }
}

export default Router
