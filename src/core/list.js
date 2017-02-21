;((undefined) => {
  Dunno.Core.List =
    class extends Array {
      constructor (base = []) {
        super()
        if (Array.isArray(base) || Dunno.Core.List.isList(base)) base.map(i => this.push(i))
      }

      // @returns the index of the item
      add (item) {
        return this.push(item)
      }

      each (callback) {
        this.map(callback)
      }

      insert (index, item) {
        if (arguments.length != 2) throw new TypeError('Must specify exactly 2 arguments (index, item)')
        this.splice(index, 0, item)
        return this.length
      }

      static isList (object) {
        return object.constructor == Dunno.Core.List
      }

      item (index) {
        return this[index]
      }
  }
})()
