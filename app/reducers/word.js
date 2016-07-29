import { LOOKUP_WORD } from '../action-types'
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

      const bestMatch = getMatch(data, id) || getBestMatch(data, query)
      const otherMatches = data.filter(x => x !== bestMatch)
      const current = getMatchingForm(bestMatch, tag) || getBestFormMatch(bestMatch, query)

      return {
        ...state,
        result: bestMatch,
        current,
        otherMatches,
      }
    }
    default:
      return state
  }
}
