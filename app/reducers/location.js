import { CHANGE_ROUTE } from '../action-types'

export default function (state = { query: '' }, action) {
  switch (action.type) {
    case CHANGE_ROUTE: {
      const query = decodeURIComponent(action.pathname.replace('/', ''))
      const { id, tag, filter } = action.params

      return { query, id, tag, filter }
    }

    default:
      return state
  }
}
