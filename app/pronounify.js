export default function(grammarTag) {
  // With personal pronoun attached
  if (grammarTag.includes('FN-NF')) {
    return null
  }

  if (grammarTag.startsWith('GM') || grammarTag.startsWith('MM')) {
    if (grammarTag.includes('1P-ET')) {
      return 'ég'
    }

    if (grammarTag.includes('2P-ET')) {
      return 'þú'
    }

    if (grammarTag.includes('3P-ET')) {
      return 'hann / hún / það'
    }

    if (grammarTag.includes('1P-FT')) {
      return 'við'
    }

    if (grammarTag.includes('2P-FT')) {
      return 'þið'
    }

    if (grammarTag.includes('3P-FT')) {
      return 'þeir / þær / þau'
    }
  }

  else if (grammarTag.startsWith('OP')) {
    if (grammarTag.includes('1P-ET')) {
      return 'mér'
    }

    if (grammarTag.includes('2P-ET')) {
      return 'þér'
    }

    if (grammarTag.includes('3P-ET')) {
      return 'honum / henni / því'
    }

    if (grammarTag.includes('1P-FT')) {
      return 'okkur'
    }

    if (grammarTag.includes('2P-FT')) {
      return 'ykkur'
    }

    if (grammarTag.includes('3P-FT')) {
      return 'þeim'
    }
  }

  else {
    return null
  }
}
