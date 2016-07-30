import { LOOKUP_CASES } from '../action-types'

export default function (state = null, action) {
  switch (action.type) {
    case LOOKUP_CASES:
      return action.data
    default:
      return state
  }
}
