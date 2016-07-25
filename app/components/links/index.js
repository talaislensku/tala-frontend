import React from 'react'
import styles from '../main/main.css'

const Links = ({ result, current, setCurrentForm }) => {
  if (!(result && current && result.forms.length)) {
    return <div />
  }

  const tags = Object.keys(current.tags)
  const listByTag = tags.includes('grammarCase') ? 'grammarCase' :
                    tags.includes('person') ? 'person' :
                    tags.includes('degree') ? 'degree' : null

  let linkTags = tags.filter(x => x !== listByTag)

  if (listByTag === 'person') {
    linkTags = linkTags.filter(x => x !== 'number')
  }

  const linkGroups = linkTags.map(tag => result.forms.filter(form => {
    const otherTags = tags.filter(t => t !== tag)
    return form.tags[tag] !== current.tags[tag] &&
      otherTags.every(otherTag => form.tags[otherTag] === current.tags[otherTag])
  })).filter(x => x && x.length !== 0)

  return (
    <div>
      {linkGroups.map((linkGroup, index) => (
        <div className={styles.linkGroup} key={index}>
          <div>
            <span className={styles.linkCurrent}>{current.tags[linkTags[index]]}</span>
            {linkGroup.length > 0 ? '→' : null}
          </div>
          <div>
            {linkGroup.map((link) => (
              <div className={styles.linkOther} key={link.grammarTag}>
                {link.tags[linkTags[index]]}:&nbsp;
                <span className={styles.link} onClick={setCurrentForm.bind(null, link)}>{link.form}</span>
              </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

Links.propTypes = {
  result: React.PropTypes.object,
  current: React.PropTypes.object,
  setCurrentForm: React.PropTypes.func.isRequired,
}

export default Links
