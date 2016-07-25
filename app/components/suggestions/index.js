import React from 'react'
import styles from '../main/main.css'
import { translate } from 'react-translate'

const Suggestions = ({t, suggestions, navigate}) => (
  suggestions && suggestions.length ?
    <div className={styles.seeAlso}>{t('did-you-mean')}:
    { suggestions.map(suggestion => {
      const navigatetoSuggestion = () => navigate(suggestion)
      return (
        <div key={suggestion}>
          <div className={styles.link} onClick={navigatetoSuggestion}>{suggestion}</div>
        </div>
      )
    }) }
    </div>
  : <div />
)

export default translate("ui")(Suggestions)
