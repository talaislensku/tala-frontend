import { LOOKUP_SUGGESTIONS } from '../action-types'

export default function (state = null, action) {
  switch (action.type) {
    case LOOKUP_SUGGESTIONS: {
      const { suggestions, corrections } = action
      if (corrections && corrections.length > 1) {
        return corrections
      }

      if (suggestions) {
        return suggestions.slice(0, 10)
      }

      return null
    }
    default:
      return state
  }
}
