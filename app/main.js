import React from 'react'
import axios from 'axios'
import classNames from 'classnames'
import { createHistory, useQueries } from 'history'
import styles from './main.css'
import Results from './results'
import LanguagePicker from './language-picker'
import SeeAlso from './see-also'

const isMobile = 'ontouchstart' in window
const api = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://api.tala.is'

export class Main extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      query: '',
      lang: localStorage.getItem('lang') || 'en'
    }

    this.history = useQueries(createHistory)()
  }

  queryChanged = (event) => {
    let query = event.target.value

    this.history.replace({
      query: {
        q: query
      }
    })
  };

  navigate = (query) => {
    let verbMode = query.startsWith('að ')

    this.setState({
      query,
      verbMode,
    })

    query = query.replace('að ', '')

    if (!query) {
      return
    }

    axios.get(`${api}/related/${query}?lang=${this.state.lang}`)
      .then(this.handleResponse)
  };

  handleResponse = ({data}) => {
    let bestMatch

    if (this.state.verbMode) {
      bestMatch = data.filter(word => word.wordClass === 'Verb' || word.wordClass === 'sagnorð')[0]
    } else {
      bestMatch = data.filter(word => word.headWord === this.state.query)[0] || data[0]
    }

    let otherMatches = data.filter(x => x !== bestMatch)

    let current

    if (this.state.verbMode) {
      current = bestMatch.forms.filter(x => x.grammarTag.includes('NT-1P-ET'))[0]
    } else {
      current = bestMatch.forms.filter(x => x && x.form === this.state.query)[0]
    }

    if (bestMatch) {
      this.setState({
        result: bestMatch,
        current,
        otherMatches,
        data,
      })
    }
  };

  onLanguageChange = (event) => {
    let lang = event.target.value
    localStorage.setItem('lang', lang)
    this.setState({ lang }, () => this.navigate(this.state.query))
  };

  setCurrentForm = (current) => {
    this.setState({current, query: current.form})

    if (!isMobile) {
      this.refs.search.focus()
    }
  };

  setCurrent = (result) => {
    this.setState({
      result: result,
      current: result.forms.filter(x => x && x.form === this.state.query)[0],
      otherMatches: this.state.data.filter(x => x !== result)
    })
  };

  componentDidMount() {
    this.history.listen(location => {
      this.navigate(location.query.q)
    })

    if (!window.location.search) {
      this.history.push('/?q=hestur')
    }

    this.refs.search.focus()
  }

  render() {
    let {query, result, current, otherMatches} = this.state

    return (
      <div className={styles.root}>
        <input ref="search" type="text" className={styles.search} value={query} onChange={this.queryChanged} placeholder="Search for an icelandic word" autoCapitalize="none" />
        <Results {...this.state} setCurrentForm={this.setCurrentForm} />
        <SeeAlso result={result} otherMatches={otherMatches} setCurrent={this.setCurrent} />
        <LanguagePicker lang={this.state.lang} onChange={this.onLanguageChange} />
      </div>
    )
  }
}
