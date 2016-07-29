import { LOOKUP_WORD, LOOKUP_SUGGESTIONS } from '../action-types'
import * as api from '../lib/api'

export function lookupWord({ query, tag, id }) {
  return async (dispatch, getState) => {
    const lang = window.localStorage.getItem('lang') || 'en'
    const { data } = await api.lookupWord(query, lang)

    if (data && data.length === 0) {
      const { data: { corrections, suggestions } } = await api.lookupSuggestions(query)

      if (corrections.length === 1) {
        // this.setSuggestion(corrections[0])
      } else {
        dispatch({
          type: LOOKUP_SUGGESTIONS,
          suggestions: corrections.concat(suggestions).slice(0, 10),
        })
      }
    }

    dispatch({
      type: LOOKUP_WORD,
      data,
      query,
      id,
      tag,
    })
  }
}
