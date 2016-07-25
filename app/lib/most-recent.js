export default func => {
  let currentPromise

  return (...args) => {
    const promise = new Promise((resolve) => {
      func.apply(null, args).then(result => {
        if (currentPromise === promise) {
          resolve(result)
        }
      })
    })

    currentPromise = promise

    return promise
  }
}
