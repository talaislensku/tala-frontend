import React from 'react'
import styles from './language-picker.css'

export default ({lang, onChange}) => {
  return (
    <div className={styles.root}>
      <span className={styles.arrow}>▾</span>
      <div className={styles.select}>
        <select type="select" value={lang} onChange={onChange}>
          <option value="en">English</option>
          <option value="is">Íslenska</option>
        </select>
      </div>
    </div>
  )
}
