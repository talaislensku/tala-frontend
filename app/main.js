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

function getBestMatch(data, query) {
  return data.filter(word => word.headWord === query)[0] ||
    data.filter(word => word.forms.some(form => form.form === query))[0] ||
    data[0]
}

function getBestFormMatch(match, query) {
  if (!(match && match.forms)) {
    return {}
  }

  return match && match.forms.filter(x => x.form.toLowerCase() === query.toLowerCase())[0]
}

function getMatchingForm(match, tag) {
  if (!(match && match.forms)) {
    return {}
  }

  return match && match.forms.filter(x => x.grammarTag === tag)[0]
}

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

  navigate = ({q: query, id, tag}) => {
    this.setState({
      query,
    })

    if (!query) {
      this.clearResults()
      this.getSuggestionsDebounced.cancel()
      return
    }

    // fetch new data only if no matches

    axios.get(`${api}/find/${query}?lang=${this.state.lang}`)
      .then(res => this.handleResponse(res, {query, id, tag}))
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

  handleResponse = ({data}, {query, id, tag}) => {
    if (data.length === 0) {
      // check if query matches start of a result

      this.getSuggestionsDebounced(query)
      this.clearResults()
      return
    }

    let bestMatch = data.filter(d => d.binId == id)[0] || getBestMatch(data, query)
    let otherMatches = data.filter(x => x !== bestMatch)
    let current = getMatchingForm(bestMatch, tag) || getBestFormMatch(bestMatch, query)

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
    this.setState({ lang }, () => this.navigate({q: this.state.query}))
  };

  setCurrentForm = (current) => {
    this.history.replace({
      query: {
        q: current.form,
        id: this.state.result.binId,
        tag: current.grammarTag,
      }
    })

    if (!isMobile) {
      this.refs.search.focus()
    }
  };

  setCurrent = (result) => {
    this.history.replace({
      query: {
        q: this.state.query,
        id: result.binId,
      }
    })
  };

  setSuggestion = (suggestion) => {
    this.history.replace({
      query: {
        q: suggestion,
      }
    })
  };

  componentDidMount() {
    this.history.listen(location => {
      this.navigate(location.query)
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
            { result && <div>
              <span className={styles.headWord}>{result.headWord}</span>
              <span className={styles.wordClass}>{result.wordClass}</span>
            </div> }

            { query && <div>
              <Results {...this.state} setCurrentForm={this.setCurrentForm} />
              <SeeAlso result={result} otherMatches={otherMatches} setCurrent={this.setCurrent} />
              <Suggestions suggestions={suggestions} navigate={this.setSuggestion} />
            </div> }

            <LanguagePicker lang={this.state.lang} onChange={this.onLanguageChange} />
          </div>
          <Footer />
        </div>
      </TranslatorProvider>
    )
  }
}
