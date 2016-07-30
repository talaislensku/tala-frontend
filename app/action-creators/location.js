import { CHANGE_ROUTE } from '../action-types'
import { createHistory, useQueries } from 'history'

const history = useQueries(createHistory)()

export function changeRoute(pathname, params = {}) {
  return (dispatch) => {
    history.replace({
      pathname,
      query: params,
    })

    dispatch({
      type: CHANGE_ROUTE,
      pathname,
      params,
    })
  }
}
