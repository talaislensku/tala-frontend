import { LOOKUP_WORD, SELECT_WORD } from '../action-types'
import {
  getMatch, getBestMatch, getMatchingForm, getBestFormMatch,
} from '../lib/matching'

export default function (state = {}, action) {
  switch (action.type) {
    case LOOKUP_WORD: {
      const { data, query, id, tag } = action

      if (!data || data.length === 0) {
        // check if query matches start of a result to reduce flicker
        return {
          ...state,
          result: null,
          current: null,
          otherMatches: null,
        }
      }

      const result = getMatch(data, id) || getBestMatch(data, query)
      const otherMatches = data.filter(x => x !== result)
      const current = getMatchingForm(result, tag) || getBestFormMatch(result, query)

      return {
        ...state,
        result,
        current,
        otherMatches,
      }
    }
    case SELECT_WORD: {
      const { query, tag } = action
      const result = state.result
      const current = getMatchingForm(result, tag) || getBestFormMatch(result, query)

      return {
        ...state,
        current,
      }
    }
    default:
      return state
  }
}
