;((undefined) => {

  var st = window.localStorage

  Dunno.Core.SettingsContext =
    class extends Dunno.Core.IStore {
      constructor (prefix, name) {
        super()
        this._prefix = prefix
        this.name = name
        this.keys = {}
      }

      clear () {
        for (var i = 0; i < st.length; i++) {
          var k = st.key(i)
          if (k.substring(0, this.prefix.length) === this.prefix) {
            st.removeItem(k)
          }
        }
      }

      get (key) {
        var result
        // get all items for this context
        if (key == undefined || key == null) {
          result = {}
          for (var i = 0, len = st.length; i < len; ++i) {
            var k = st.key(i)
            if (k.substring(0, this.prefix.length) === this.prefix) {
              result[k.substring(this.prefix.length, k.length)] = JSON.parse(st.getItem(k))
            }
          }
        } else {
          result = JSON.parse(st.getItem(this.keyize(key)))
        }

        return result
      }

      // parse a storage key to the internal representation
      keyize (key) {
        return this._prefix + '.' + this.name + '.' + key
      }

      get prefix () {
        return this._prefix + '.' + this.name + '.'
      }

      set (key, value) {
        st.setItem(this.keyize(key), JSON.stringify(value))
      }
  }
})()
