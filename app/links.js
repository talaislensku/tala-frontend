import React from 'react'
import styles from './main.css'

const Links = ({result, current, setCurrent}) => {

  if (!(result && current && result.forms.length)) {
    return null
  }

  const tags = Object.keys(current.tags)
  const linkTags = tags.filter(x => x !== 'grammarCase')

  const links = linkTags.map(tag => result.forms.filter(form => (
    form.tags[tag] !== current.tags[tag] &&
    tags.filter(t => t !== tag).every(otherTag => form.tags[otherTag] === current.tags[otherTag])
  ))[0]).filter(x => x)

  return (
    <div className={styles.linksSection}>
      { links && links.map((link, index) => (
        <div className={styles.links} key={index}>
          <div className={styles.column}>
            <div className={styles.linkCurrent}>{current.tags[linkTags[index]]}</div>
            <div className={styles.linkOther}>{link.tags[linkTags[index]]}</div>
          </div>
          <div className={styles.columnEnd}>
            <div className={styles.link} onClick={setCurrent.bind(null, link)}>{link.form}</div>
          </div>
        </div>
      )) }
    </div>
  )
}

Links.propTypes = {
  result: React.PropTypes.object,
  current: React.PropTypes.object,
  setCurrent: React.PropTypes.func.isRequired,
}

export default Links
