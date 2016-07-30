import { LOOKUP_CASES } from '../action-types'
import * as api from '../lib/api'

export function lookupCases(headWord) {
  return async (dispatch) => {
    const { data } = await api.lookupCases(headWord)

    dispatch({
      type: LOOKUP_CASES,
      data,
    })
  }
}
