import React from 'react'
import styles from './loader.css'

export default ({loading}) => (
  loading ? <div className={styles.loader} /> : <div />
)
