import { CHANGE_ROUTE } from '../action-types'
import { createHistory, useQueries } from 'history'

const history = useQueries(createHistory)()

export function changeRoute(pathname, params = {}) {
  return (dispatch, getState) => {
    const { location } = getState()
    const { query, ...prevParams } = location

    const nextParams = {
      ...prevParams,
      ...params,
    }

    history.replace({
      pathname,
      query: nextParams,
    })

    dispatch({
      type: CHANGE_ROUTE,
      pathname,
      params: nextParams,
    })
  }
}
