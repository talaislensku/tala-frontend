import React from 'react'
import styles from './main.css'
import { translate } from 'react-translate'

const SeeAlso = ({t, otherMatches, result, setCurrent}) => (
  otherMatches && otherMatches.length ?
    <div className={styles.seeAlso}>{t('see-also')}:
    { otherMatches.map(result => {
      return <div key={result.wordClass}>
        <div className={styles.link} onClick={setCurrent.bind(null, result)}>{result.headWord} {result.wordClass}</div>
      </div>
    }) }
    </div>
  : <div />
)

export default translate("ui")(SeeAlso)
