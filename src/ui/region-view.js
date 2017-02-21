;((undefined) => {

  Dunno.UI.RegionView =
    class extends HTMLElement {
      constructor(options = {}) {
        super()

        this.id = options.id
      }
  }

  window.customElements.define('region-view', Dunno.UI.RegionView)
})()
