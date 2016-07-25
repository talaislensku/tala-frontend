import React from 'react'
import styles from './cases.css'
import { translate } from 'react-translate'

const Cases = ({ t, cases }) => (
  cases ? <span className={styles.cases}>
    {cases[1] && <div>+ {t(cases[1])}</div>}
    {cases[2] && <div>+ {t(cases[2])}</div>}
  </span> : <span />
)

export default translate('cases')(Cases)