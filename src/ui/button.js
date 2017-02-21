;((undefined) => {

  Dunno.UI.Button =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)
      }

      click(handler) {
        
      }
  }

  window.customElements.define('button', Dunno.UI.Button)
})()
