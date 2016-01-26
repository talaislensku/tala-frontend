import React from 'react'
import styles from './main.css'
import classNames from 'classnames'
import Links from './Links'

const Results = ({query, result, current, setCurrent}) => {

  let visible = result && result.forms.length && result.forms.filter(x =>
    x.tags.number === current.tags.number &&
    x.tags.article === current.tags.article
  )

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

          <div>
            <span className={styles.headWord}>{result.headWord}</span>
            <span className={styles.wordClass}>{result.wordClass}</span>
          </div>

          <div className={styles.entries}>
          { visible.map(x => (
            <div key={x.grammarTag} className={wordClasses(x)}>
              <div className={styles.case}>{x.tags.grammarCase}</div>
              <div className={styles.wordForm}>{x.form}</div>
            </div>
          )) }
          </div>

          <Links result={result} current={current} setCurrent={setCurrent} />
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

