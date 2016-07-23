export default func => {
  let current;

  return (...args) => {
    current = Date.now()

    const promise = new Promise((resolve, reject) => {
      func.apply(null, args).then(result => {
        if (promise.current === current) {
          resolve(result)
        }
      })
    })

    promise.current = current

    return promise
  }
}
