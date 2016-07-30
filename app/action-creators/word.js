import {
  LOOKUP_WORD,
  SELECT_WORD,
  LOOKUP_SUGGESTIONS,
  START_LOADING,
  STOP_LOADING,
} from '../action-types'
import * as api from '../lib/api'

export function lookupWord() {
  return async (dispatch, getState) => {
    let { query, tag, id } = getState().location

    if (!query) {
      dispatch({
        type: LOOKUP_WORD,
      })

      return
    }

    const { lang } = getState()

    // If id === previous id, eagerly return data

    dispatch({
      type: START_LOADING,
    })

    let { data } = await api.lookupWord(query, lang)

    if (data && data.length === 0 && query.length > 1) {
      const { data: { corrections, suggestions } } = await api.lookupSuggestions(query)
      // Race condition here between lookupWord and lookupSuggestions

      if (corrections.length === 1) {
        query = corrections[0]
        data = (await api.lookupWord(query, lang)).data
      } else {
        dispatch({
          type: LOOKUP_SUGGESTIONS,
          corrections,
          suggestions,
        })
      }
    } else {
      dispatch({
        type: LOOKUP_SUGGESTIONS,
      })
    }

    dispatch({
      type: LOOKUP_WORD,
      data,
      query,
      id,
      tag,
    })

    dispatch({
      type: STOP_LOADING,
    })
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
