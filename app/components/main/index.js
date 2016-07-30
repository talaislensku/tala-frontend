import React from 'react'
import { TranslatorProvider } from 'react-translate'
import { connect } from 'react-redux'
import { changeLanguage } from '../../action-creators/lang'

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

class Main extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    query: React.PropTypes.string,
    updateRoute: React.PropTypes.func,
    id: React.PropTypes.string,
    tag: React.PropTypes.string,
    word: React.PropTypes.shape({
      result: React.PropTypes.object,
      current: React.PropTypes.object,
      otherMatches: React.PropTypes.array,
    }),
    lang: React.PropTypes.string,
    suggestions: React.PropTypes.array,
  }

  componentDidMount() {
    this.refs.search.focus()
  }

  onLanguageChange = (event) => {
    const lang = event.target.value
    this.props.dispatch(changeLanguage(lang))
  }

  // getSuggestions = (query) => api.lookupSuggestions(query)
  //   .then(({ data }) => {
  //     const { corrections, suggestions } = data
  //
  //     if (corrections.length === 1) {
  //       this.setSuggestion(corrections[0])
  //     } else {
  //       this.setState({ suggestions: corrections.concat(suggestions).slice(0, 10) })
  //     }
  //   })

  setCurrentForm = (current) => {
    const { updateRoute } = this.props
    updateRoute(current.form, {
      id: this.props.word.result.binId,
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

  // getCases() {
  //   if (isVerb(bestMatch)) {
  //     api.lookupCases(bestMatch.headWord)
  //       .then(({ data: cases }) => this.setState({ cases }))
  //   } else {
  //     this.setState({ cases: null })
  //   }
  // }

  queryChanged = (event) => {
    const { updateRoute } = this.props
    updateRoute(event.target.value)
  }

  render() {
    const { query, lang, suggestions } = this.props
    const { result, current, otherMatches } = this.props.word
    const { loading, cases } = {}
    const t = translations[lang]

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

            <LanguagePicker lang={lang} onChange={this.onLanguageChange} />
          </div>
          <Footer />
        </div>
      </TranslatorProvider>
    )
  }
}

export default connect(({ word, suggestions, lang }) => ({ word, suggestions, lang }))(Main)
