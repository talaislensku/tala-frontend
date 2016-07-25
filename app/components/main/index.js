import React from 'react'
import axios from 'axios'
import { createHistory, useQueries } from 'history'
import debounce from 'lodash.debounce'
import { TranslatorProvider } from 'react-translate'
import mostRecent from '../../lib/most-recent'

import styles from './main.css'
import Results from '../results'
import LanguagePicker from '../language-picker'
import SeeAlso from '../see-also'
import Suggestions from '../suggestions'
import Logo from '../logo'
import Loader from '../loader'
import Footer from '../footer'
import Cases from '../cases'
import translations from '../../../translations.yaml'

const isMobile = 'ontouchstart' in window
const api = window.location.hostname === 'tala.dev' ? 'http://api.tala.dev' : 'http://api.tala.is'
const isVerb = word => word.wordClass === 'Verb' || word.wordClass === 'sagnorð'

function getBestMatch(data, query) {
  return data.filter(word =>
    word.forms && word.forms.some(form =>
      form.form === query && form.grammarTag === 'GM-NH'))[0] ||
    data.filter(word => word.headWord === query)[0] ||
    data.filter(word => word.forms.some(form => form.form === query))[0] ||
    data.filter(word => isVerb(word))[0] ||
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

const getWord = (word, lang) => axios.get(`${api}/find/${word}?lang=${lang}`)
const lookupWord = mostRecent(getWord)

const getCases = (word, lang) => axios.get(`${api}/cases/${word}?lang=${lang}`)
const lookupCases = mostRecent(getCases)

const getSuggestions = (query) => axios.get(`http://corrections.tala.is/${query}`)
const lookupSuggestions = mostRecent(getSuggestions)

export class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      query: '',
      lang: localStorage.getItem('lang') || 'en',
    }

    this.history = useQueries(createHistory)()
    this.getSuggestionsDebounced = debounce(this.getSuggestions, 500)
    this.loadingEndDebounced = debounce(() => this.setState({ loading: false }), 500)
  }

  getSuggestions = (query) => {
    return lookupSuggestions(query)
      .then(({ data }) => {
        const { corrections, suggestions } = data

        if (corrections.length === 1) {
          this.setSuggestion(corrections[0])
        } else {
          this.setState({ suggestions: corrections.concat(suggestions).slice(0, 10) })
        }
      })
  }

  componentDidMount() {
    this.history.listen(location => {
      this.navigate(location.query)
    })

    if (!window.location.search) {
      this.history.push('/?q=hestur')
    }

    this.refs.search.focus()
  }

  onLanguageChange = (event) => {
    const lang = event.target.value
    localStorage.setItem('lang', lang)
    this.setState({ lang }, () => this.navigate({ q: this.state.query }))
  }

  setCurrentForm = (current) => {
    this.history.replace({
      query: {
        q: current.form,
        id: this.state.result.binId,
        tag: current.grammarTag,
      },
    })

    if (!isMobile) {
      this.refs.search.focus()
    }
  }

  setCurrent = (result) => {
    this.history.replace({
      query: {
        q: this.state.query,
        id: result.binId,
      },
    })
  }

  setSuggestion = (suggestion) => {
    this.history.replace({
      query: {
        q: suggestion,
      },
    })
  }

  clearResults = () => {
    this.setState({
      result: null,
      current: null,
      otherMatches: null,
      suggestions: null,
      cases: null,
    })
  }

  handleResponse = ({ data }, { query, id, tag }) => {
    if (!data) {
      return
    }

    if (data.length === 0) {
      // check if query matches start of a result to reduce flicker

      this.getSuggestionsDebounced(query)
      this.clearResults()
      return
    }

    const bestMatch = data.filter(d => d.binId === id)[0] || getBestMatch(data, query)
    const otherMatches = data.filter(x => x !== bestMatch)
    const current = getMatchingForm(bestMatch, tag) || getBestFormMatch(bestMatch, query)

    if (bestMatch) {
      if (isVerb(bestMatch)) {
        lookupCases(bestMatch.headWord)
          .then(({ data: cases }) => this.setState({ cases }))
      } else {
        this.setState({ cases: null })
      }

      this.getSuggestionsDebounced.cancel()
      this.setState({
        result: bestMatch,
        current,
        otherMatches,
        data,
        suggestions: [],
      })
    }
  }

  navigate = async ({ q: query, id, tag }) => {
    this.setState({
      query,
    })

    if (!query) {
      this.clearResults()
      this.getSuggestionsDebounced.cancel()
      return
    }

    this.setState({ loading: true })

    try {
      const res = await lookupWord(query, this.state.lang)
      this.handleResponse(res, { query, id, tag })
    } finally {
      this.loadingEndDebounced()
    }
  }

  queryChanged = (event) => {
    const query = event.target.value

    this.history.replace({
      query: {
        q: query,
      },
    })
  }

  render() {
    let { query, result, otherMatches, suggestions, loading, cases } = this.state
    const t = translations[this.state.lang]

    return (
      <TranslatorProvider translations={t}>
        <div className={styles.root}>
          <div className={styles.content}>
            <Logo />
            <input
              ref="search"
              type="text"
              className={styles.search}
              value={query}
              onChange={this.queryChanged}
              placeholder={t.ui['search-for-an-icelandic-word']}
              autoCapitalize="none"
            />
            <Loader loading={loading} />
            {result && <div>
              <span className={styles.headWord}>{result.headWord}</span>
              <span className={styles.wordClass}>{result.wordClass}</span>

              <Cases cases={cases} headWord={result.headWord} />
            </div>}

            {query && <div>
              <Results {...this.state} setCurrentForm={this.setCurrentForm} />
              <SeeAlso result={result} otherMatches={otherMatches} setCurrent={this.setCurrent} />
              <Suggestions suggestions={suggestions} navigate={this.setSuggestion} />
            </div>}

            <LanguagePicker lang={this.state.lang} onChange={this.onLanguageChange} />
          </div>
          <Footer />
        </div>
      </TranslatorProvider>
    )
  }
}
