;((undefined) => {

  Dunno.UI.ToolbarView =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)

        this.items = new List()
      }
  }

  window.customElements.define('toolbar-view', Dunno.UI.ToolbarView)
})()
