class SyncStorage {
  constructor(storage = localStorage) {
    this.storage = storage
  }

  getItem(key) {
    return this.storage.getItem(key)
  }

  setItem(key, value) {
    return this.storage.setItem(key, value)
  }
}

export default new SyncStorage()
