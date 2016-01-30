import React from 'react'
import styles from './main.css'

export default ({otherMatches, result, setCurrent}) => (
  otherMatches && otherMatches.length ?
    <div className={styles.seeAlso}>See also:
    { otherMatches.map(result => {
      return <div key={result.wordClass} className={styles.links}>
        <div className={styles.link} onClick={setCurrent.bind(null, result)}>{result.headWord} {result.wordClass}</div>
      </div>
    }) }
    </div>
  : <div />
)
