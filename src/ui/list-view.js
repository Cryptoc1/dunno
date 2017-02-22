;((undefined) => {

  Dunno.UI.ListView =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)
        this.items = new Dunno.Core.List()
      }

      add (item) {
        var index = this.items.add(item)
        item.on('disconnected', e => {
          this.items.remove(this.items.indexOf(item))
        })
        this.append(item)
        return index
      }

      remove (index) {
        if (index < 0 || index > this.items.length) return
        var item = this.items[index]
        item.remove()
        this.items = this.items.filter((item, i) => i != index)
        this.emit('removed', item)
      }

      // marks the item at `index` as selected, returns that item (or undefined)
      select (index) {
        if (!index) index = 0
        var item = this.items[index]
        return item ? (item.select(), item) : undefined
      }

      get selected () {
        var s = this.items.filter(child => child.selected)
        return s[0]
      }
  }

  window.customElements.define('list-view', Dunno.UI.ListView)
})()

;((undefined) => {

  Dunno.UI.ListItem =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)

        this.on('connected', e => {
          if (!(this.parentNode instanceof Dunno.UI.ListView)) console.warn('ListItem was not attached to a ListView, this may cause unexpected behavior')
        })
      }

      remove (callback = function () {}) {
        super.remove()
        this.once('disconnected', e => {
          return callback(e)
        })
      }

      select () {
        return this.emit('selected'), this.selected = true
      }

      get selected () {
        return this.getAttribute('selected') === 'true'
      }

      set selected (value) {
        var value = !!value
        this.setAttribute('selected', value)

        // unselect the other items
        if (this.parentNode instanceof Dunno.UI.ListView) {
          this.parentNode.items.each(item => {
            if (item != this) item.setAttribute('selected', false)
          })
        }

        return value ? (this.emit('selected'), value) : value
      }
  }

  window.customElements.define('list-item', Dunno.UI.ListItem)
})()
