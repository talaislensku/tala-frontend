import { SET_FILTER } from '../action-types'

export default function (state = null, action) {
  switch (action.type) {
    case SET_FILTER:
      return action.filter
    default:
      return state
  }
}
