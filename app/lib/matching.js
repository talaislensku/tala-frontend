export const isVerb = word => word.wordClass === 'Verb' || word.wordClass === 'sagnorð'

export function getMatch(data, id) {
  return data.filter(d => d.binId === Number(id))[0]
}

export function getBestMatch(data, query) {
  return data.filter(word =>
          word.forms && word.forms.some(form =>
            form.form === query && form.grammarTag === 'GM-NH'))[0] ||
    data.filter(word => word.headWord === query)[0] ||
    data.filter(word => word.forms.some(form => form.form === query))[0] ||
    data.filter(word => isVerb(word))[0] ||
    data[0]
}

export function getBestFormMatch(match, query) {
  if (!(match && match.forms)) {
    return {}
  }

  return match && match.forms.filter(x => x.form.toLowerCase() === query.toLowerCase())[0]
}

export function getMatchingForm(match, tag) {
  if (!(match && match.forms)) {
    return {}
  }

  return match && match.forms.filter(x => x.grammarTag === tag)[0]
}
