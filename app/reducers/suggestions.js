import { LOOKUP_SUGGESTIONS } from '../action-types'

export default function (state = {}, action) {
  switch (action.type) {
    case LOOKUP_SUGGESTIONS:
      return action.suggestions
    default:
      return state
  }
}
