;((undefined) => {

  Dunno.UI.TextView =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)

        this.shadow.style.appendChild(document.createTextNode(`:host([disabled="true"]) { background-color: #FAFAFA; }`))

        if (!options.editable && !options.disabled) this.editable = true

        this.changeTimeout = null
        this._textContent = this.textContent
        this.on('keydown', e => this.keydown(e))
        this.on('keyup', e => this.keyup(e))
        this.on('blur', e => this.checkForChange(e))
      }

      checkForChange () {
        if (this.textContent !== this._textContent) {
          var changeEvent = new Event('change', {
            cancelable: true
          })
          this.dispatchEvent(changeEvent)
          if (changeEvent.defaultPrevented) {
            this.textContent = this._textContent
          }
        }
        this._textContent = this.textContent
      }

      get disabled () {
        return !this.editable
      }

      set disabled (value) {
        this.editable = value != true
      }

      get editable () {
        return this.contentEditable
      }

      set editable (value) {
        this.setAttribute('disabled', value != true)
        return this.contentEditable = (value == true)
      }

      keydown (e) {
        this.resetChangeTimeout()
      }

      keyup (e) {
        var self = this
        self.resetChangeTimeout()
        this.changeTimeout = window.setTimeout(() => {
          self.checkForChange()
          self.resetChangeTimeout()
        }, 450)
      }

      resetChangeTimeout () {
        window.clearTimeout(this.changeTimeout)
        this.changeTimeout = null
      }

      get value () {
        return this.innerHTML.replace(/<div><br><\/div>/g, '\n').replace(/(<div>)/g, '\n').replace(/(<\/div>)/g, '').replace(/(<br>)/g, '\n')
      }

      set value (value) {
        this.innerHTML = value.replace(/\n/g, '<div><br></div>')
      }
  }

  window.customElements.define('text-view', Dunno.UI.TextView)
})()
