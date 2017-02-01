;((dunno, undefined) => {

  class MasterView extends HTMLDivElement {
    createdCallback () {
      this.id = 'master-view'
      // this.className = 'master-view view'
      this.style.width = '100%'
    }
  }

  dunno.MasterView = document.registerElement('master-view', MasterView)

  window.Dunno = dunno
})(window.Dunno || {})
