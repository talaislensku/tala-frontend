import { CHANGE_LANGUAGE } from '../action-types'
import storage from '../lib/sync-storage'

export function changeLanguage(lang) {
  return (dispatch) => {
    storage.setItem('lang', lang)

    dispatch({
      type: CHANGE_LANGUAGE,
      lang,
    })
  }
}
