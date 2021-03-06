import React from 'react'
import { TranslatorProvider } from 'react-translate'
import { connect } from 'react-redux'
import { changeLanguage } from '../../action-creators/lang'
import { changeRoute } from '../../action-creators/location'
import { lookupWord, selectWord } from '../../action-creators/word'
import { lookupCases } from '../../action-creators/cases'

import styles from './main.css'

import Cases from '../cases'
import Error from '../error'
import Filter from '../filter'
import Footer from '../footer'
import LanguagePicker from '../language-picker'
import Loader from '../loader'
import Logo from '../logo'
import Results from '../results'
import SeeAlso from '../see-also'
import Suggestions from '../suggestions'
import translations from '../../../translations.yaml'

const isMobile = 'ontouchstart' in window

function getCurrentFilter(filter, currentTags) {
  const tags = Object.keys(currentTags)

  if (tags.includes(filter)) {
    return filter
  }

  const currentFilter = tags.includes('grammarCase') ? 'grammarCase' :
                    tags.includes('person') ? 'person' :
                    tags.includes('degree') ? 'degree' : null

  return currentFilter
}

class Main extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    location: React.PropTypes.shape({
      query: React.PropTypes.string,
      id: React.PropTypes.string,
      tag: React.PropTypes.string,
    }),
    word: React.PropTypes.shape({
      result: React.PropTypes.object,
      current: React.PropTypes.object,
      otherMatches: React.PropTypes.array,
    }),
    lang: React.PropTypes.string,
    suggestions: React.PropTypes.array,
    loading: React.PropTypes.bool,
    filter: React.PropTypes.string,
    cases: React.PropTypes.object,
  }

  componentDidMount() {
    this.props.dispatch(lookupWord())
    this.refs.search.focus()
  }

  componentWillReceiveProps(props) {
    if (props.word.result !== this.props.word.result) {
      this.props.dispatch(lookupCases(props.word.result))
    }
  }

  onLanguageChange = (event) => {
    const lang = event.target.value
    this.props.dispatch(changeLanguage(lang))
    this.props.dispatch(lookupWord())
  }

  setCurrentForm = (current) => {
    const { dispatch, word } = this.props

    dispatch(changeRoute(current.form, {
      id: word.result.binId,
      tag: current.grammarTag,
    }))
    dispatch(selectWord())

    if (!isMobile) {
      this.refs.search.focus()
    }
  }

  setCurrent = (result) => {
    const { dispatch, location } = this.props
    dispatch(changeRoute(location.query, { id: result.binId }))
    dispatch(lookupWord())
  }

  setSuggestion = (suggestion) => {
    this.props.dispatch(changeRoute(suggestion))
    this.props.dispatch(lookupWord())
  }

  setFilter = (tag) => {
    const { dispatch, location } = this.props
    dispatch(changeRoute(location.query, { filter: tag }))
  }

  queryChanged = (event) => {
    this.props.dispatch(changeRoute(event.target.value))
    this.props.dispatch(lookupWord())
  }

  render() {
    const { location, lang, suggestions, loading, cases, error } = this.props
    const { query, filter } = location
    const { result, current, otherMatches } = this.props.word

    const t = translations[lang]

    const currentFilter = current && current.tags && getCurrentFilter(filter, current.tags)

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
            <Error error={error} />

            {!error && result && <div>
              <span className={styles.headWord}>{result.headWord}</span>
              <span className={styles.wordClass}>{result.wordClass}</span>

              <Cases cases={cases} headWord={result.headWord} />
            </div>}

            {!error && query && <div>
              {current && current.tags && <Filter currentFilter={currentFilter} tags={current.tags} setFilter={this.setFilter} />}
              <Results currentFilter={currentFilter} result={result} current={current} setCurrentForm={this.setCurrentForm} />
              <SeeAlso result={result} otherMatches={otherMatches} setCurrent={this.setCurrent} />
              <Suggestions suggestions={suggestions} navigate={this.setSuggestion} />
            </div>}

            <LanguagePicker lang={lang} onChange={this.onLanguageChange} />
          </div>
          <Footer />
        </div>
      </TranslatorProvider>
    )
  }
}

export default connect(({ word, suggestions, lang, location, loading, filter, cases, error }) =>
  ({ word, suggestions, lang, location, loading, filter, cases, error }))(Main)
