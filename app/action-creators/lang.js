import { CHANGE_LANGUAGE } from '../action-types'
import { lookupWord } from './word'

export function changeLanguage(lang) {
  return (dispatch, getState) => {
    window.localStorage.setItem('lang', lang)

    dispatch({
      type: CHANGE_LANGUAGE,
      lang,
    })

    // const { query, id, tag } = getState().word
    // lookupWord({ query, id, tag })(dispatch, getState)
  }
}
