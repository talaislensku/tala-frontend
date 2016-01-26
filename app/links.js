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

  let articleLink = result.forms.filter(x =>
    x.tags.article !== current.tags.article &&
    x.tags.number === current.tags.number &&
    x.tags.grammarCase === current.tags.grammarCase
  )[0]

  return (
    <div className={styles.links}>
      { numberLink &&
        <div className={styles.links}>
          <span>{numberLink.tags.number}:</span>
          <div className={styles.link} onClick={setCurrent.bind(null, numberLink)}>{numberLink.form}</div>
        </div>
      }

      { articleLink &&
        <div className={styles.links}>
          <span>{articleLink && articleLink.tags.article}:</span>
          <div className={styles.link} onClick={setCurrent.bind(null, articleLink)}>{articleLink.form}</div>
        </div>
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
