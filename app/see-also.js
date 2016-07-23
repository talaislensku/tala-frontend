import React from 'react'
import styles from './main.css'
import { translate } from 'react-translate'

const SeeAlso = ({t, otherMatches, setCurrent}) => (
  otherMatches && otherMatches.length ?
    <div className={styles.seeAlso}>{t('see-also')}:
    { otherMatches.map(result => {
      const setCurrentResult = () => setCurrent(result)
      return <div key={result.headWord + result.wordClass}>
        <div className={styles.link} onClick={setCurrentResult}>{result.headWord}  {result.wordClass}</div>
      </div>
    }) }
    </div>
  : <div />
)

export default translate("ui")(SeeAlso)
