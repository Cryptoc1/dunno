;((undefined) => {

  class MasterView extends HTMLDivElement {
    createdCallback () {
      this.id = 'master-view'
      // this.className = 'master-view view'
      this.style.width = '100%'
    }
  }

  window.Dunno.UI.MasterView = document.registerElement('master-view', MasterView)
})()
