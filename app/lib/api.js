import axios from 'axios'
import mostRecent from './most-recent'

const api = window.location.hostname === 'tala.dev' ?
  'http://api.tala.dev' : 'http://api.tala.is'

const getWord = (word, lang) => axios.get(`${api}/find/${word}?lang=${lang}`)
export const lookupWord = mostRecent(getWord)

const getCases = (word, lang) => axios.get(`${api}/cases/${word}?lang=${lang}`)
export const lookupCases = mostRecent(getCases)

const getSuggestions = (query) => axios.get(`http://corrections.tala.is/${query}`)
export const lookupSuggestions = mostRecent(getSuggestions)
