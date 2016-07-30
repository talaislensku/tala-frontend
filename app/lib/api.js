import axios from 'axios'

const api = window.location.hostname === 'tala.dev' ?
  'http://api.tala.dev' : 'http://api.tala.is'

export function lookupWord(word, lang) {
  return axios.get(`${api}/find/${word}?lang=${lang}`)
}

export function lookupCases(word, lang) {
  return axios.get(`${api}/cases/${word}?lang=${lang}`)
}

export function lookupSuggestions(query) {
  return axios.get(`http://corrections.tala.is/${query}`)
}
