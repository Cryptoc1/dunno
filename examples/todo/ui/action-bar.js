// ActionBar

;((undefined) => {
  Todo.UI.ActionBar =
    class extends Dunno.UI.ListView {
      constructor (options = {}) {
        super(options)
      }
  }

  window.customElements.define('action-bar', Todo.UI.ActionBar)
})()

// ActionBarItem

;((undefined) => {

  /*
    ActionBarItem is a wrapper around a font-awesome icon
  */
  Todo.UI.ActionItem =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)

        this.shadowStyle.cursor = 'pointer'
        this.shadowStyle.display = 'inline-block'

        this.classList.add('fa')
      }

      get icon () {
        return this._icon
      }

      set icon (value) {
        value = '' + value + ''
        this._icon = value
        this.classList.add('fa-' + value)
      }
  }

  window.customElements.define('action-item', Todo.UI.ActionItem)
})()
