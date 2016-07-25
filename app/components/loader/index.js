import React from 'react'
import styles from './loader.css'

const Loader = ({ loading }) => (
  loading ? <div className={styles.loader} /> : <div />
)

Loader.propTypes = {
  loading: React.PropTypes.bool,
}

export default Loader
