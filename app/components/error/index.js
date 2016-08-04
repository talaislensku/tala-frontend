import React from 'react'
import styles from './error.css'

const Error = ({ error }) => {
  if (!error) {
    return <div />
  }

  const { type, message } = error

  return (
    <div className={styles.root}>
      <div className={styles.type}>Error in action {type}</div>
      <div className={styles.message}>{message}</div>
    </div>
  )
}

Error.propTypes = {
  error: React.PropTypes.shape({
    type: React.PropTypes.string,
    message: React.PropTypes.string,
  })

}

export default Error
