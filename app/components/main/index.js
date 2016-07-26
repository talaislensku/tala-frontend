import React from 'react'
import debounce from 'lodash.debounce'
import { TranslatorProvider } from 'react-translate'
import {
  isVerb, getMatch, getBestMatch, getMatchingForm, getBestFormMatch,
} from '../../lib/matching'

import * as api from '../../lib/api'
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

export default class Main extends React.Component {
  static initialState = {
    cases: null,
    current: null,
    otherMatches: null,
    result: null,
    suggestions: null,
  }

  static propTypes = {
    query: React.PropTypes.string,
    updateRoute: React.PropTypes.func,
    params: React.PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = Main.initialState
    this.getSuggestionsDebounced = debounce(this.getSuggestions, 500)
    this.loadingEndDebounced = debounce(() => this.setState({ loading: false }), 500)
  }

  componentDidMount() {
    const { query, params: { id, tag } } = this.props
    this.navigate({ query, id, tag })
    this.refs.search.focus()
  }

  componentWillReceiveProps(props) {
    const { query, params: { id, tag } } = props
    this.navigate({ query, id, tag })
  }

  onLanguageChange = (event) => {
    const lang = event.target.value
    localStorage.setItem('lang', lang)

    const { query, params: { id, tag } } = this.props
    this.navigate({ query, id, tag })
  }

  getSuggestions = (query) => api.lookupSuggestions(query)
    .then(({ data }) => {
      const { corrections, suggestions } = data

      if (corrections.length === 1) {
        this.setSuggestion(corrections[0])
      } else {
        this.setState({ suggestions: corrections.concat(suggestions).slice(0, 10) })
      }
    })

  setCurrentForm = (current) => {
    const { updateRoute } = this.props
    updateRoute(current.form, {
      id: this.state.result.binId,
      tag: current.grammarTag,
    })

    if (!isMobile) {
      this.refs.search.focus()
    }
  }

  setCurrent = (result) => {
    const { updateRoute, query } = this.props
    updateRoute(query, { id: result.binId })
  }

  setSuggestion = (suggestion) => {
    const { updateRoute } = this.props
    updateRoute(suggestion)
  }

  getLang = () => window.localStorage.getItem('lang') || 'en'

  clearResults = () => {
    this.setState(Main.initialState)
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

    const bestMatch = getMatch(data, id) || getBestMatch(data, query)
    const otherMatches = data.filter(x => x !== bestMatch)
    const current = getMatchingForm(bestMatch, tag) || getBestFormMatch(bestMatch, query)

    if (bestMatch) {
      if (isVerb(bestMatch)) {
        api.lookupCases(bestMatch.headWord)
          .then(({ data: cases }) => this.setState({ cases }))
      } else {
        this.setState({ cases: null })
      }

      this.getSuggestionsDebounced.cancel()
      this.setState({
        result: bestMatch,
        current,
        otherMatches,
        suggestions: [],
      })
    }
  }

  navigate = async ({ query, id, tag }) => {
    if (!query) {
      this.clearResults()
      this.getSuggestionsDebounced.cancel()
      return
    }

    this.setState({ loading: true })

    try {
      const res = await api.lookupWord(query, this.getLang())
      this.handleResponse(res, { query, id, tag })
    } finally {
      this.loadingEndDebounced()
    }
  }

  queryChanged = (event) => {
    const { updateRoute } = this.props
    updateRoute(event.target.value)
  }

  render() {
    const { query } = this.props
    const { result, current, otherMatches, suggestions, loading, cases } = this.state
    const t = translations[this.getLang()]

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
              <Results result={result} current={current} setCurrentForm={this.setCurrentForm} />
              <SeeAlso result={result} otherMatches={otherMatches} setCurrent={this.setCurrent} />
              <Suggestions suggestions={suggestions} navigate={this.setSuggestion} />
            </div>}

            <LanguagePicker lang={this.getLang()} onChange={this.onLanguageChange} />
          </div>
          <Footer />
        </div>
      </TranslatorProvider>
    )
  }
}
