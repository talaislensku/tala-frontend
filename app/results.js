import React from 'react'
import styles from './main.css'
import classNames from 'classnames'

const Results = ({query, result, current, setCurrent}) => {

  let visible = result && result.forms.length && result.forms.filter(x =>
    x.tags.number === current.tags.number &&
    x.tags.article === current.tags.article
  )

  let numberLink = visible && result.forms.filter(x =>
    x.tags.number !== current.tags.number &&
    x.tags.article === current.tags.article &&
    x.tags.grammarCase === current.tags.grammarCase
  )[0]

  let articleLink = visible && result.forms.filter(x =>
    x.tags.article !== current.tags.article &&
    x.tags.number === current.tags.number &&
    x.tags.grammarCase === current.tags.grammarCase
  )[0]

  let wordClasses = (word) => {
    return classNames({
      [styles.word]: true,
      [styles.wordMatch]: query === word.form
    })
  }

  return (
    <div>
      { visible &&
        <div>
          <div className={styles.currentTags}>
            { current && Object.keys(current.tags).map(tag => <span key={tag}>{current.tags[tag]} </span>) }
          </div>

          <div>{result.headWord} {result.wordClass}</div>

          <div className={styles.entries}>
          { visible.map(x => (
            <div key={x.grammarTag} className={wordClasses(x)}>
              <div className={styles.case}>{x.tags.grammarCase}</div>
              <div className={styles.wordForm}>{x.form}</div>
            </div>
          )) }
          </div>

          <div className={styles.links}>
            {numberLink.tags.number}: <div className={styles.link} onClick={setCurrent.bind(null, numberLink)}>{numberLink.form}</div>
            {articleLink && articleLink.tags.article}: <div className={styles.link} onClick={setCurrent.bind(null, articleLink)}>{articleLink.form}</div>
          </div>

          { false && <pre>{JSON.stringify(result, null, 2)}</pre> }
        </div>
      }
    </div>
  )
}

Results.propTypes = {
  query: React.PropTypes.string,
  result: React.PropTypes.object,
  current: React.PropTypes.object,
  setCurrent: React.PropTypes.func.isRequired,
}

export default Results

