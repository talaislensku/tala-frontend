import {
  LOOKUP_WORD,
  SELECT_WORD,
  LOOKUP_SUGGESTIONS,
  START_LOADING,
  STOP_LOADING,
} from '../action-types'

import * as api from '../lib/api'
import mostRecent from '../lib/most-recent'

const getResultsOrSuggestions = mostRecent(async (query, lang) => {
  let { data: words } = await api.lookupWord(query, lang)
  let corrections
  let suggestions
  let correctedQuery

  if (words && words.length === 0) {
    const { data } = await api.lookupSuggestions(query)
    suggestions = data.suggestions
    corrections = data.corrections

    if (corrections.length === 1) {
      correctedQuery = corrections[0]
      words = (await api.lookupWord(correctedQuery, lang)).data
      suggestions = null
      corrections = null
    }
  }

  return {
    correctedQuery,
    words,
    corrections,
    suggestions,
  }
})

export function lookupWord() {
  return async (dispatch, getState) => {
    const { lang } = getState()
    let { query, tag, id } = getState().location

    if (!query) {
      dispatch({
        type: LOOKUP_WORD,
      })

      return
    }

    dispatch({ type: START_LOADING })

    const {
      correctedQuery,
      words,
      corrections,
      suggestions,
    } = await getResultsOrSuggestions(query, lang)

    dispatch({
      type: LOOKUP_SUGGESTIONS,
      corrections,
      suggestions,
    })

    dispatch({
      type: LOOKUP_WORD,
      data: words,
      query: correctedQuery || query,
      id,
      tag,
    })

    dispatch({ type: STOP_LOADING })
  }
}

export function selectWord() {
  return (dispatch, getState) => {
    const { query, tag, id } = getState().location

    dispatch({
      type: SELECT_WORD,
      query,
      tag,
      id,
    })

    dispatch(lookupWord())
  }
}
