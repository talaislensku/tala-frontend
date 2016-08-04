export default func => {
  let currentPromise

  return (...args) => {
    const promise = new Promise((resolve, reject) => {
      func.apply(null, args).then(result => {
        if (currentPromise === promise) {
          resolve(result)
        }
      }, reject)
    })

    currentPromise = promise

    return promise
  }
}
