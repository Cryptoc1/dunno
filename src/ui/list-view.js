;((undefined) => {

  Dunno.UI.ListView =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)
        this.items = new Dunno.Core.List()
      }

      add (item) {
        this.append(item)
        return this.items.add(item)
      }

      remove (index) {
        if (index < 0 || index > this.items.length) return
        var item = this.items[index]
        item.remove()
        this.items = this.items.filter((item, i) => i != index)
        this.emit('removed', item)
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

      get selected () {
        return this.getAttribute('selected')
      }

      set selected (value) {
        this.setAttribute('selected', !!value)

        if (this.parentNode instanceof Dunno.UI.ListView) {
          for (var i = 0; i < this.parentNode.children.length; i++) {
            var child = this.parentNode.children[i]
            if (child != this && child instanceof Dunno.UI.ListItem) child.setAttribute('selected', false)
          }
        }

        return !!value
      }
  }

  window.customElements.define('list-item', Dunno.UI.ListItem)
})()
