import React from 'react'
import styles from './main.css'
import classNames from 'classnames'
import Links from './links'
import pronounify from './pronounify'
import { translate } from 'react-translate'

function getListByTag(currentTags) {
  const tags = Object.keys(currentTags)
  const listByTag = tags.includes('grammarCase') ? 'grammarCase' :
                    tags.includes('person') ? 'person' :
                    tags.includes('degree') ? 'degree' : null

  return listByTag
}

function getVisible(listByTag, tags, forms) {
  let otherTags = Object.keys(tags).filter(x => x !== listByTag)

  if (listByTag === 'person') {
    otherTags = otherTags.filter(x => x !== 'number')
  }

  const visible = forms && forms.filter(
    form => otherTags.every(
      otherTag => form.tags[otherTag] === tags[otherTag]))

  return visible
}

const Results = ({ t, result, current, setCurrentForm }) => {
  if (!result) {
    return <div>{t('no-results')}</div>
  }

  if (!(current && current.tags)) {
    return <div>{t('no-alternate-forms')}</div>
  }

  const listByTag = getListByTag(current.tags)
  const visible = getVisible(listByTag, current.tags, result.forms)

  const wordClasses = word => classNames({
    [styles.word]: true,
    [styles.wordMatch]: current === word,
    [styles.alternate]: word.grammarTag.endsWith('2'),
  })

  return (
    <div>
      {visible &&
        <div>
          <div className={styles.entries}>
            {visible.map(x => (
              <div key={x.grammarTag} className={wordClasses(x)} onClick={setCurrentForm.bind(null, x)}>
                <div className={styles.case}>{pronounify(x.grammarTag) || x.tags[listByTag]}</div>
                <div className={styles.wordForm}>{x.form}</div>
              </div>
            ))}
          </div>

          <Links result={result} current={current} setCurrentForm={setCurrentForm} />
        </div>
      }
    </div>
  )
}

Results.propTypes = {
  t: React.PropTypes.func,
  result: React.PropTypes.object,
  current: React.PropTypes.object,
  setCurrentForm: React.PropTypes.func.isRequired,
}

export default translate('ui')(Results)
