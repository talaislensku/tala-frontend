import React from 'react'
import axios from 'axios'
import debounce from 'lodash.debounce'

import styles from './main.css'
import Results from './results'
import SeeAlso from './see-also'
import Suggestions from './suggestions'

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

const lookupWord = (function() {
  let current;

  function getWord(word, lang) {
    current = word

    let promise = new Promise((resolve, reject) => {
      axios.get(`${api}/find/${word}?lang=${lang}`)
        .then(result => {
          if (promise.word === current) {
            resolve(result)
          }
        })
    })

    promise.word = word

    return promise
  }

  return getWord
})()

export default class Word extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }

    this.onChange = this.props.onChange.bind(null, props.query)

    this.getSuggestionsDebounced = debounce(this.getSuggestions, 500)
  }

  static propTypes = {
    query: React.PropTypes.string,
    lang: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  };

  navigate = ({q: query, id, tag}) => {
    if (!query) {
      this.clearResults()
      this.getSuggestionsDebounced.cancel()
      return
    }

    lookupWord(query, this.props.lang)
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
    if (!data) {
      return
    }

    if (data.length === 0) {
      // check if query matches start of a result to reduce flicker

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

  setCurrentForm = (current) => {
    this.onChange({
      query: {
        q: current.form,
        id: this.state.result.binId,
        tag: current.grammarTag,
      }
    })
  };

  setCurrent = (result) => {
    this.onChange({
      query: {
        q: this.props.query,
        id: result.binId,
      }
    })
  };

  setSuggestion = (suggestion) => {
    this.onChange({
      query: {
        q: suggestion,
      }
    })
  };

  componentDidMount() {
    this.navigate({q: this.props.query})
  }

  componentWillReceiveProps(props) {
    this.onChange = this.props.onChange.bind(null, props.query)

    this.navigate({q: props.query})
  }

  render() {
    let {query} = this.props
    let {result, current, otherMatches, suggestions} = this.state

    return (
      <div>
        { result && <div>
          <span className={styles.headWord}>{result.headWord}</span>
          <span className={styles.wordClass}>{result.wordClass}</span>
        </div> }

        { query && <div>
          <Results {...this.state} setCurrentForm={this.setCurrentForm} />
          <SeeAlso result={result} otherMatches={otherMatches} setCurrent={this.setCurrent} />
          <Suggestions suggestions={suggestions} navigate={this.setSuggestion} />
        </div> }
      </div>
    )
  }
}
