import React from 'react'
import styles from './main.css'

export default ({suggestions, navigate}) => (
  suggestions && suggestions.length ?
    <div className={styles.seeAlso}>Did you mean:
    { suggestions.map(suggestion => {
      return <div key={suggestion} className={styles.links}>
        <div className={styles.link} onClick={navigate.bind(null, suggestion)}>{suggestion}</div>
      </div>
    }) }
    </div>
  : <div />
)
