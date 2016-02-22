import React from 'react'
import classNames from 'classnames'
import { createHistory, useQueries } from 'history'
import { TranslatorProvider } from "react-translate"

import styles from './main.css'
import Results from './results'
import LanguagePicker from './language-picker'
import SeeAlso from './see-also'
import Suggestions from './suggestions'
import Logo from './logo'
import Footer from './footer'
import Word from './word'
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
  }

  queryChanged = (event) => {
    let query = event.target.value

    this.history.replace({
      query: {
        q: query
      }
    })
  };

  onLanguageChange = (event) => {
    let lang = event.target.value
    localStorage.setItem('lang', lang)
    this.setState({ lang }, () => this.navigate({q: this.state.query}))
  };

  onWordChange = (oldWord, newWord) => {
    var query = this.state.query.replace(oldWord, newWord.query.q)

    this.history.replace({
      query: {
        q: query
      }
    })

    if (!isMobile) {
      this.refs.search.focus()
    }
  };

  navigate = ({q: query}) => {
    this.setState({
      query,
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
    let {query, lang} = this.state
    const t = translations[this.state.lang]

    return (
      <TranslatorProvider translations={t}>
        <div className={styles.root}>
          <div className={styles.content}>
            <Logo />
            <input ref="search" type="text" className={styles.search} value={query} onChange={this.queryChanged} placeholder={t.ui['search-for-an-icelandic-word']} autoCapitalize="none" />

            <div className={styles.words}>
              { query.split(' ').map(word => (
                <Word query={word} lang={lang} onChange={this.onWordChange} />
              ))}
            </div>

            <LanguagePicker lang={lang} onChange={this.onLanguageChange} />
          </div>
          <Footer />
        </div>
      </TranslatorProvider>
    )
  }
}
