import { LOOKUP_WORD, LOOKUP_SUGGESTIONS } from '../action-types'
import * as api from '../lib/api'

export function lookupWord({ query, tag, id }) {
  return async (dispatch, getState) => {
    if (!query) {
      dispatch({
        type: LOOKUP_WORD,
      })

      return
    }

    const { lang } = getState()
    // If id and id === getState().word.id
    let { data } = await api.lookupWord(query, lang)

    if (data && data.length === 0 && query.length > 1) {
      const { data: { corrections, suggestions } } = await api.lookupSuggestions(query)

      if (corrections.length === 1) {
        query = corrections[0]
        data = (await api.lookupWord(query, lang)).data
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
