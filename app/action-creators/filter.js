import { SET_FILTER } from '../action-types'

export function setFilter(tag) {
  return {
    type: SET_FILTER,
    filter: tag,
  }
}
