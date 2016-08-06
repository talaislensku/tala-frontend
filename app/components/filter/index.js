import React from 'react'
import classNames from 'classnames'
import styles from './filter.css'
import { translate } from 'react-translate'

const Filter = ({ t, currentFilter, tags, setFilter }) => (
  <div className={styles.root}>
      <span className={styles.filter}>Filter by:</span>
   {Object.keys(tags).map(tag => {
     const onClick = () => setFilter(tag)
     const linkStyles = classNames({
       [styles.link]: true,
       [styles.currentLink]: tag === currentFilter,
     })
     return (
       <span key={tag} onClick={onClick} className={linkStyles}>
        {t(tag)}
       </span>
     )
   })}
  </div>
)

export default translate('filters')(Filter)
