import React from 'react'
import styles from './main.css'
import classNames from 'classnames'
import Links from './links'

const Results = ({query, result, current, otherMatches, setCurrentForm}) => {
  if (!(result && current && result.forms.length)) {
    return <div />
  }

  const tags = Object.keys(current.tags)
  const otherTags = tags.filter(x => x !== 'grammarCase')

  let visible = result.forms.filter(form => otherTags.every(
      otherTag => form.tags[otherTag] === current.tags[otherTag]))

  let wordClasses = (word) => {
    return classNames({
      [styles.word]: true,
      [styles.wordMatch]: current === word
    })
  }

  return (
    <div>
      { visible &&
        <div>
          <div>
            <span className={styles.headWord}>{result.headWord}</span>
            <span className={styles.wordClass}>{result.wordClass}</span>
          </div>

          <div className={styles.entries}>
          { visible.map(x => (
            <div key={x.grammarTag} className={wordClasses(x)} onClick={setCurrentForm.bind(null, x)}>
              <div className={styles.case}>{x.tags.grammarCase}</div>
              <div className={styles.wordForm}>{x.form}</div>
            </div>
          )) }
          </div>

          <Links result={result} current={current} setCurrentForm={setCurrentForm} />
        </div>
      }
    </div>
  )
}

Results.propTypes = {
  query: React.PropTypes.string,
  result: React.PropTypes.object,
  current: React.PropTypes.object,
  setCurrentForm: React.PropTypes.func.isRequired,
}

export default Results

