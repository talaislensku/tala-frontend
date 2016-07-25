import React from 'react'
import styles from './see-also.css'
import linkStyles from '../links/links.css'
import { translate } from 'react-translate'

const SeeAlso = ({ t, otherMatches, setCurrent }) => (
  otherMatches && otherMatches.length ?
    <div className={styles.seeAlso}>{t('see-also')}:
    {otherMatches.map(result => {
      const setCurrentResult = () => setCurrent(result)
      return (
        <div key={result.headWord + result.wordClass}>
          <div className={linkStyles.link} onClick={setCurrentResult}>
            {result.headWord} {result.wordClass}
          </div>
        </div>
      )
    })}
    </div>
  : <div />
)

SeeAlso.propTypes = {
  t: React.PropTypes.func,
  otherMatches: React.PropTypes.array,
  setCurrent: React.PropTypes.func,
}

export default translate('ui')(SeeAlso)
