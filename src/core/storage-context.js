;((undefined) => {
  var st = window.localStorage

  Dunno.Core.StorageContext =
    class extends Dunno.Core.EventEmitter {
      constructor (options = {}) {
        super()
        this._prefix = options.prefix
        this.name = options.name
        this.keys = {}

        switch (options.store) {
          case 'IndexedDB':
            this.store = new Dunno.Core.IndexStore()
            break
          case 'localStorage':
            this.store = new Dunno.Core.LocalStore()
            break
          default:
            if (window.indexedDB) this.store = new Dunno.Core.IndexStore()
            else if (window.localStorage) this.store = new Dunno.Core.LocalStore()
            else throw new Error('No supported stores were found on this system')
        }
      }

      clear (callback) {
        if (!callback) callback = () => {
        }
        setTimeout(() => {
          this.store.clear(callback)
        }, 0)
      }

      get (key, callback) {
        if (!callback) callback = () => {
        }
        setTimeout(() => {
          this.store.get(this.keyize(key), (err, value) => {
            if (err) return callback(err)
            callback(null, JSON.parse(value))
          })
        }, 0)
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
        setTimeout(() => {
          this.store.set(this.keyize(key), JSON.stringify(value), callback)
        }, 0)
      }
  }
})()

// IStore

;((undefined) => {

  Dunno.Core.IStore =
    class {
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
})()

// IndexStore

;((undefined) => {

  Dunno.Core.IndexStore =
    class extends Dunno.Core.IStore {
      constructor () {
        super()

        this.dbName = 'KVPStore'
        this.storeName = 'kvp'
      }

      get (key, callback) {
        var self = this

        if (!callback) callback = function () {}

        this.open((err, db) => {
          if (err) return callback(err)

          var transaction = db.transaction([self.storeName])
          var store = transaction.objectStore(self.storeName)
          var request = store.get(key)

          request.onerror = (e) => {
            callback(e)
            db.close()
          }

          request.onsuccess = (e) => {
            var value = (e.target.result) ? e.target.result.value : null
            callback(null, value)
            db.close()
          }
        })
      }

      open (callback) {
        if (!callback) callback = function () {}

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
            db.close()
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
                db.close()
              }

              add.onsuccess = (e) => {
                callback(null, e.target.result)
                db.close()
              }
            } else {
              entry.value = value

              var put = store.put(entry)

              put.onerror = (e) => {
                callback(e)
                db.close()
              }

              put.onsuccess = (e) => {
                callback(null, e.target.result)
                db.close()
              }
            }
          }
        })
      }

  }
})()

// LocalStore

;((undefined) => {

  var st = window.localStorage

  Dunno.Core.LocalStore =
    class extends Dunno.Core.IStore {
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
})()
