;((undefined) => {
  var st = window.localStorage

  class StorageContext extends EventEmitter {
    constructor (options = {}) {
      super()
      this._prefix = options.prefix
      this.name = options.name
      this.keys = {}

      switch (options.store) {
        case 'IndexedDB':
          this.store = new IndexStore()
          break
        case 'localStorage':
          this.store = new LocalStore()
          break
        default:
          if (window.indexedDB) this.store = new IndexStore()
          else if (window.localStorage) this.store = new LocalStore()
          else throw new Error('No supported stores were found on this system')
      }
    }

    clear (callback) {
      if (!callback) callback = () => {
      }
      this.store.clear(callback)
    }

    get (key, callback) {
      if (!callback) callback = () => {
      }
      this.store.get(this.keyize(key), (err, value) => {
        if (err) return callback(err)
        callback(null, JSON.parse(value))
      })
    }

    // parse a storage key to the internal representation
    keyize (key) {
      return this._prefix + '.' + this.name + '.' + key
    }

    get prefix () {
      return this._prefix + '.' + this.name + '.'
    }

    set (key, value, callback) {
      if (!callback) callback = () => {
      }
      this.store.set(this.keyize(key), JSON.stringify(value), callback)
    }
  }

  window.StorageContext = StorageContext
})()

// IStore

;((undefined) => {

  class IStore {
    // constructor() {}

    clear (callback) {
      throw new Error('Not Implemented')
    }

    get (key, callback) {
      throw new Error('Not Implemented')
    }

    set (key, value, callback) {
      throw new Error('Not Implemented')
    }
  }

  window.IStore = IStore
})()

// IndexStore

;((undefined) => {

  class IndexStore extends IStore {
    constructor () {
      super()

      this.dbName = 'KVPStore'
      this.storeName = 'kvp'
    }

    get (key, callback) {
      var self = this

      if (!callback) callback = () => {
      }

      this.open((err, db) => {
        if (err) return callback(err)

        var transaction = db.transaction([self.storeName])
        var store = transaction.objectStore(self.storeName)
        var request = store.get(key)

        request.onerror = (e) => {
          callback(e)
        }

        request.onsuccess = (e) => {
          var value = (e.target.result) ? e.target.result.value : null
          callback(null, value)
        }
      })
    }

    open (callback) {
      if (!callback) callback = () => {
      }

      var request = indexedDB.open(this.dbName, 2)

      request.onerror = (e) => {
        console.log(e)
        callback(e)
      }

      request.onsuccess = (e) => {
        var db = e.target.result
        callback(null, db)
      }

      request.onupgradeneeded = function (e) {
        console.log('IndexStore: upgrade needed')

        var store = e.currentTarget.result.createObjectStore('kvp', {
          keyPath: 'key'
        })
      }
    }

    set (key, value, callback) {
      if (!callback) callback = () => {
      }

      var self = this

      this.open((err, db) => {
        if (err) return callback(err)

        var transaction = db.transaction([self.storeName], 'readwrite')
        var store = transaction.objectStore(self.storeName)

        var get = store.get(key)

        get.onerror = (e) => {
          callback(e)
        }

        get.onsuccess = (e) => {
          var entry = e.target.result
          if (!entry) {
            var add = store.add({
              key: key,
              value: value
            })

            add.onerror = (e) => {
              callback(e)
            }

            add.onsuccess = (e) => {
              callback(null, e.target.result)
            }
          } else {
            entry.value = value

            var put = store.put(entry)

            put.onerror = (e) => {
              callback(e)
            }

            put.onsuccess = (e) => {
              callback(null, e.target.result)
            }
          }
        }
      })
    }

  }

  window.IndexStore = IndexStore
})()

// LocalStore

;((undefined) => {

  var st = window.localStorage

  class LocalStore extends IStore {
    constructor () {
      super()
    }

    get (key, callback) {
      if (!callback) callback = () => {
      }

      setTimeout(() => {
        return callback(st.getItem(key))
      }, 0)
    }

    set (key, value, callback) {
      if (!callback) callback = () => {
      }

      setTimeout(() => {
        st.setItem(key, value)
        return callback()
      }, 0)
    }
  }

  window.LocalStore = LocalStore
})()
