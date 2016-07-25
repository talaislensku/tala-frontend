import React from 'react'
import styles from './language-picker.css'

const LanguagePicker = ({ lang, onChange }) => (
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

LanguagePicker.propTypes = {
  lang: React.PropTypes.oneOf(['en', 'is']),
  onChange: React.PropTypes.func,
}

export default LanguagePicker
