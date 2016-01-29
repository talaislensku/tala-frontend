import React from 'react'
import styles from './main.css'

const Links = ({result, current, setCurrent}) => {

  if (!(result && current && result.forms.length)) {
    return null
  }

  let numberLink = result.forms.filter(x =>
    x.tags.number !== current.tags.number &&
    x.tags.article === current.tags.article &&
    x.tags.grammarCase === current.tags.grammarCase
  )[0]

  if (numberLink) {
    numberLink.tag = 'number'
  }

  let articleLink = result.forms.filter(x =>
    x.tags.article !== current.tags.article &&
    x.tags.number === current.tags.number &&
    x.tags.grammarCase === current.tags.grammarCase
  )[0]

  if (articleLink) {
    articleLink.tag = 'article'
  }

  return (
    <div className={styles.linksSection}>
      { numberLink && articleLink && [numberLink, articleLink].map((link, index) => (
        <div className={styles.links} key={index}>
          <div className={styles.column}>
            <div className={styles.linkCurrent}>{current.tags[link.tag]}</div>
            <div className={styles.linkOther}>{link.tags[link.tag]}</div>
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
