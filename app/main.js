import React from 'react'
import axios from 'axios'
import classNames from 'classnames'
import { createHistory, useQueries } from 'history'
import debounce from 'lodash.debounce'
import { TranslatorProvider } from "react-translate"

import styles from './main.css'
import Results from './results'
import LanguagePicker from './language-picker'
import SeeAlso from './see-also'
import Suggestions from './suggestions'
import Logo from './logo'
import Footer from './footer'
import translations from '../translations.yaml'

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
    this.getSuggestionsDebounced = debounce(this.getSuggestions, 500)
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
    this.setState({
      query,
    })

    if (!query) {
      this.clearResults()
      return
    }

    axios.get(`${api}/related/${query}?lang=${this.state.lang}`)
      .then(this.handleResponse)
  };

  getSuggestions = (query) => {
    return axios.get(`${api}/suggestions/${query}`)
        .then(({data}) => {
          this.setState({
            suggestions: data
          })
        })
  };

  clearResults = () => {
    this.setState({
      result: null,
      current: null,
      otherMatches: null,
      suggestions: null,
    })
  };

  handleResponse = ({data}) => {
    if (data.length === 0) {
      // check if query matches start of a result

      this.getSuggestionsDebounced(this.state.query)
      this.clearResults()
      return
    }

    let bestMatch = data.filter(word => word.headWord === this.state.query)[0] || data[0]
    let otherMatches = data.filter(x => x !== bestMatch)
    let current = bestMatch && bestMatch.forms.filter(x => x && x.form === this.state.query)[0]

    if (bestMatch) {
      this.getSuggestionsDebounced.cancel()
      this.setState({
        result: bestMatch,
        current,
        otherMatches,
        data,
        suggestions: []
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
    let {query, result, current, otherMatches, suggestions} = this.state
    const t = translations[this.state.lang]

    return (
      <TranslatorProvider translations={t}>
        <div className={styles.root}>
          <div className={styles.content}>
            <Logo />
            <input ref="search" type="text" className={styles.search} value={query} onChange={this.queryChanged} placeholder={t.ui['search-for-an-icelandic-word']} autoCapitalize="none" />
            <Results {...this.state} setCurrentForm={this.setCurrentForm} />
            <SeeAlso result={result} otherMatches={otherMatches} setCurrent={this.setCurrent} />
            <Suggestions suggestions={suggestions} navigate={this.navigate} />
            <LanguagePicker lang={this.state.lang} onChange={this.onLanguageChange} />
          </div>
          <Footer />
        </div>
      </TranslatorProvider>
    )
  }
}
