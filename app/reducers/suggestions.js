import { LOOKUP_SUGGESTIONS } from '../action-types'

export default function (state = null, action) {
  switch (action.type) {
    case LOOKUP_SUGGESTIONS:
      return action.suggestions
    default:
      return state
  }
}
