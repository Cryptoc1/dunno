;((undefined) => {

  Dunno.UI.MasterView =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)

        this.id = 'master-view'

        this.shadow.style.append(document.createTextNode(`
          :host {
            width: 100%;
            display: block;
            margin: 0;
            padding: 0;
          }`))
      }
  }

  window.customElements.define('master-view', Dunno.UI.MasterView)
})()
