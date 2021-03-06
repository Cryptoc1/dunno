;((undefined) => {

  Dunno.Core.IModel =
    class extends Dunno.Core.EventEmitter {
      clone () {
        throw new Error('Not Implemented')
      }
      destroy () {
        throw new Error('Not Implemented')
      }
      get () {
        throw new Error('Not Implemented')
      }
      save () {
        throw new Error('Not Implemented')
      }
      set () {
        throw new Error('Not Implemented')
      }
      sync () {
        throw new Error('Not Implemented')
      }

  }
})()

;((undefined) => {
  Dunno.Core.Model =
    class extends Dunno.Core.IModel {
      constructor (attributes = {}) {
        super()

        this.attributes = attributes
        if (this.attributes.id) this.id = this.attributes.id
      }

      clone () {
        return new Dunno.Core.Model(this.attributes)
      }

      get (attribute) {
        return this.attributes[attribute]
      }
      
      static guid () {
        function s4 () {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
      }

      set (attribute, value) {
        this.emit('change', {
          attribute: attribute,
          oldValue: this.attributes[attribute],
          value: value
        })
        this.attributes[attribute] = value
      }
  }
})()
