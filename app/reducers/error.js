import { START_LOADING } from '../action-types'

export default function (state = null, action) {
  switch (action.type) {
    case START_LOADING:
      return null
    default: {
      const { error } = action
      if (error) {
        return {
          type: action.type,
          message: error.data || error.message,
        }
      }
      return state
    }
  }
}
