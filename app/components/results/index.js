import React from 'react'
import styles from './results.css'
import classNames from 'classnames'
import Links from '../links'
import pronounify from '../../lib/pronounify'
import { translate } from 'react-translate'

const isVerb = word => word.wordClass === 'Verb' || word.wordClass === 'sagnorð'

function getVisible(currentFilter, tags, forms) {
  let otherTags = Object.keys(tags).filter(x => x !== currentFilter)

  if (currentFilter === 'person') {
    otherTags = otherTags.filter(x => x !== 'number')
  }

  const visible = forms && forms.filter(
    form => otherTags.every(
      otherTag => form.tags[otherTag] === tags[otherTag]))

  return visible
}

const Results = ({ t, result, current, setCurrentForm, currentFilter }) => {
  if (!result) {
    return <div>{t('no-results')}</div>
  }

  if (!(current && current.tags)) {
    return <div>{t('no-alternate-forms')}</div>
  }

  const visible = getVisible(currentFilter, current.tags, result.forms)

  const wordClasses = word => classNames({
    [styles.word]: true,
    [styles.wordMatch]: current.grammarTag === word.grammarTag,
    [styles.alternate]: word.grammarTag.endsWith('2'),
  })

  const entriesClasses = classNames({
    [styles.entries]: true,
    [styles.vertical]: currentFilter === 'grammarCase' || visible.length > 3
  })

  return (
    <div>
      {visible &&
        <div>
          <div className={entriesClasses}>
            {visible.map(x => (
              <div key={x.grammarTag} className={wordClasses(x)} onClick={setCurrentForm.bind(null, x, result)}>
                <div className={styles.case}>{currentFilter === 'person' ? pronounify(x.grammarTag) : x.tags[currentFilter]}</div>
                <div className={styles.wordForm}>{x.form}</div>
              </div>
            ))}
          </div>

          {false && isVerb(result) ?
            result.forms.filter(x => x.grammarTag === 'GM-SAGNB').map(word =>
              <div key="GM-SAGNB">hafa {word.form}</div>)
          : null}

          <Links
            currentFilter={currentFilter}
            result={result}
            current={current}
            setCurrentForm={setCurrentForm}
          />
        </div>
      }
    </div>
  )
}

Results.propTypes = {
  t: React.PropTypes.func,
  result: React.PropTypes.object,
  current: React.PropTypes.object,
  currentFilter: React.PropTypes.string,
  setCurrentForm: React.PropTypes.func.isRequired,
}

export default translate('ui')(Results)
