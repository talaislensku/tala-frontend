import React from 'react'
import styles from '../see-also/see-also.css'
import linkStyles from '../links/links.css'
import { translate } from 'react-translate'

const Suggestions = ({ t, suggestions, navigate }) => (
  suggestions && suggestions.length ?
    <div className={styles.seeAlso}>{t('did-you-mean')}:
    {suggestions.map(suggestion => {
      const navigatetoSuggestion = () => navigate(suggestion)
      return (
        <div key={suggestion}>
          <div className={linkStyles.link} onClick={navigatetoSuggestion}>{suggestion}</div>
        </div>
      )
    })}
    </div>
  : <div />
)

Suggestions.propTypes = {
  suggestions: React.PropTypes.array,
  navigate: React.PropTypes.func,
  t: React.PropTypes.func,
}

export default translate('ui')(Suggestions)
