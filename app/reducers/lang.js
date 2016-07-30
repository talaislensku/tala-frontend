import { CHANGE_LANGUAGE } from '../action-types'

export default function (state = {}, action) {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return action.lang
    default:
      return state
  }
}
