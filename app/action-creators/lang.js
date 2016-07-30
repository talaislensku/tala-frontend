import { CHANGE_LANGUAGE } from '../action-types'
import { lookupWord } from './word'
import storage from '../lib/sync-storage'

export function changeLanguage(lang) {
  return (dispatch, getState) => {
    storage.setItem('lang', lang)

    dispatch({
      type: CHANGE_LANGUAGE,
      lang,
    })

    // const { query, id, tag } = getState().word
    // lookupWord({ query, id, tag })(dispatch, getState)
  }
}
