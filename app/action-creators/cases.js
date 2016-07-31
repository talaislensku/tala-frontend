import { LOOKUP_CASES } from '../action-types'
import * as api from '../lib/api'

const isVerb = (word) => word && (word.wordClass === 'Verb' || word.wordClass === 'sagnorð')

export function lookupCases(result) {
  return async (dispatch) => {
    if (isVerb(result)) {
      const { data } = await api.lookupCases(result.headWord)

      dispatch({
        type: LOOKUP_CASES,
        data,
      })
    } else {
      dispatch({
        type: LOOKUP_CASES,
      })
    }
  }
}
