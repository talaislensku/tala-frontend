import React from 'react'
import styles from './main.css'

const Links = ({result, current, setCurrent}) => {

  if (!(result && current && result.forms.length)) {
    return null
  }

  const tags = Object.keys(current.tags)
  const linkTags = tags.filter(x => x !== 'grammarCase')

  const linkGroups = linkTags.map(tag => result.forms.filter(form => {
    const otherTags = tags.filter(t => t !== tag)
    return form.tags[tag] !== current.tags[tag] &&
      otherTags.every(otherTag => form.tags[otherTag] === current.tags[otherTag])
  })).filter(x => x)

  return (
    <div className={styles.linksSection}>
      { linkGroups && linkGroups.map((linkGroup, index) => (
          linkGroup.map((link) => (
            <div className={styles.links}>
              <div className={styles.column}>
                <div className={styles.linkCurrent}>{current.tags[linkTags[index]]}</div>
                <div className={styles.linkOther}>{link.tags[linkTags[index]]}</div>
              </div>
              <div className={styles.columnEnd}>
                <div className={styles.link} onClick={setCurrent.bind(null, link)}>{link.form}</div>
              </div>
            </div>
          ))
        ))
      }
    </div>
  )
}

Links.propTypes = {
  result: React.PropTypes.object,
  current: React.PropTypes.object,
  setCurrent: React.PropTypes.func.isRequired,
}

export default Links
