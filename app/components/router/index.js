import React from 'react'
import { connect } from 'react-redux'
import { createHistory, useQueries } from 'history'
import { lookupWord } from '../../action-creators/word'

import Main from '../main'

class Router extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.history = useQueries(createHistory)()

    this.state = {
      location: this.history.getCurrentLocation(),
    }
  }

  componentDidMount() {
    this.history.listen(this.onHistoryChange)
    this.onHistoryChange(this.history.getCurrentLocation())
  }

  onHistoryChange = (location) => {
    this.setState({ location })

    const query = this.getQuery()
    const { id, tag } = location.query

    this.props.dispatch(lookupWord({ query, id, tag }))
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
        id={location.query.id}
        tag={location.query.tag}
        updateRoute={this.updateRoute}
      />
    )
  }
}

export default connect()(Router)
