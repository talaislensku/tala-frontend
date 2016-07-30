import React from 'react'
import classNames from 'classnames'
import styles from './filter.css'

const Filter = ({ listByTag, tags, setFilter }) => (
  <div className={styles.root}>
   {Object.keys(tags).map(tag => {
     const onClick = () => setFilter(tag)
     const linkStyles = classNames({
       [styles.link]: true,
       [styles.currentLink]: tag === listByTag,
     })
     return (
       <span key={tag} onClick={onClick} className={linkStyles}>
        {tag}
       </span>
     )
   })}
  </div>
)

export default Filter
