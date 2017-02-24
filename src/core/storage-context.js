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
        return this.store.clear(callback)
      }

      get (key, callback) {
        return new Promise((resolve, reject) => {
          var req = this.store.get(this.keyize(key))

          req.then(res => resolve(JSON.parse(res)))
          req.catch(err => reject(err))
        })
      }

      // parse a storage key to the internal representation
      keyize (key) {
        return this._prefix + '.' + this.name + '.' + key
      }

      get prefix () {
        return this._prefix + '.' + this.name + '.'
      }

      set (key, value) {
        return this.store.set(this.keyize(key), JSON.stringify(value))
      }
  }
})()

// IStore

;((undefined) => {

  Dunno.Core.IStore =
    class {
      // constructor() {}

      clear () {
        throw new Error('Not Implemented')
      }

      get (key) {
        throw new Error('Not Implemented')
      }

      set (key, value) {
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

      get (key) {
        return new Promise((resolve, reject) => {

          var open = this.open()

          open.then(db => {
            var transaction = db.transaction([this.storeName])
            var store = transaction.objectStore(this.storeName)
            var request = store.get(key)

            request.onerror = err => {
              return db.close(), reject(err)
            }

            request.onsuccess = (e) => {
              var value = (e.target.result) ? e.target.result.value : null
              return db.close(), resolve(value)
            }
          })

          open.catch(err => reject(err))
        })
      }

      open () {
        return new Promise((resolve, reject) => {

          var request = indexedDB.open(this.dbName, 2)

          request.onerror = err => reject(err)

          request.onsuccess = e => resolve(e.target.result)

          request.onupgradeneeded = e => {
            console.log('IndexStore: upgrade needed')
            var store = e.currentTarget.result.createObjectStore('kvp', {
              keyPath: 'key'
            })
          }
        })
      }

      set (key, value) {
        return new Promise((resolve, reject) => {
          var open = this.open()

          open.then(db => {
            var transaction = db.transaction([this.storeName], 'readwrite')
            var store = transaction.objectStore(this.storeName)

            var get = store.get(key)

            get.onerror = err => {
              return db.close(), reject(err)
            }

            get.onsuccess = e => {
              var entry = e.target.result

              if (!entry) {
                var add = store.add({
                  key: key,
                  value: value
                })

                add.onerror = err => {
                  return db.close(), reject(err)
                }

                add.onsuccess = e => {
                  return db.close(), resolve(e.target.resolve)
                }
              } else {
                entry.value = value

                var put = store.put(entry)

                put.onerror = err => {
                  return db.close(), reject(err)
                }

                put.onsuccess = e => {
                  return db.close(), resolve(e.target.result)
                }
              }
            }
          })

          open.catch(err => reject(err))
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

      get (key) {
        return new Promise(function (resolve, reject) {
          try {
            return resolve(st.getItem(key))
          } catch (err) {
            return reject(err)
          }
        })
      }

      set (key, value) {
        return new Promise(function (resolve, reject) {
          try {
            return st.setItem(key, value), resolve(key)
          } catch (err) {
            return reject(err)
          }
        })
      }
  }
})()
