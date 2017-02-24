;((undefined) => {

  Dunno.UI.BaseView =
    class extends HTMLElement {
      constructor (options = {}) {
        super()

        for (var key in options) {
          this[key] = options[key]
        }

        this.initShadowDOM()
        this.bindEvents()
      }

      bindEvents () {
        // Forward DOM Events using the .on/.emit syntax

        // MOUSE
        this.addEventListener('click', e => this.emit('click', e))
        this.addEventListener('contextmenu', e => this.emit('contextmenu', e))
        this.addEventListener('dblclick', e => this.emit('dblclick', e))
        this.addEventListener('mousedown', e => this.emit('mousedown', e))
        this.addEventListener('mouseup', e => this.emit('mouseup', e))
        this.addEventListener('mousemove', e => this.emit('mousemove', e))
        this.addEventListener('mouseenter', e => this.emit('mouseenter', e))
        this.addEventListener('mouseleave', e => this.emit('mouseleave', e))
        this.addEventListener('mouseover', e => this.emit('mouseover', e))
        this.addEventListener('mouseout', e => this.emit('mouseout', e))
        this.addEventListener('wheel', e => this.emit('wheel', e))
        this.addEventListener('scroll', e => this.emit('scroll', e))

        // KEYBAORD
        this.addEventListener('keydown', e => this.emit('keydown', e))
        this.addEventListener('keypress', e => this.emit('keypress', e))
        this.addEventListener('keyup', e => this.emit('keyup', e))

        // CLIPBOARD
        this.addEventListener('paste', e => this.emit('paste', e))
        this.addEventListener('cut', e => this.emit('cut', e))
        this.addEventListener('copy', e => this.emit('copy', e))

        // DRAG
        this.addEventListener('drag', e => this.emit('drag', e))
        this.addEventListener('dragstart', e => this.emit('dragstart', e))
        this.addEventListener('dragend', e => this.emit('dragend', e))
        this.addEventListener('dragenter', e => this.emit('dragenter', e))
        this.addEventListener('dragleave', e => this.emit('dragleave', e))
        this.addEventListener('dragover', e => this.emit('dragover', e))
        this.addEventListener('drop', e => this.emit('drop', e))

        // INPUT
        this.addEventListener('input', e => this.emit('input', e))
        this.addEventListener('blur', e => this.emit('blur', e))
        this.addEventListener('focus', e => this.emit('focus', e))
        this.addEventListener('focusin', e => this.emit('focusin', e))
        this.addEventListener('focusout', e => this.emit('focusout', e))
        this.addEventListener('change', e => this.emit('change', e))
        this.addEventListener('select', e => this.emit('select', e))

        // TOUCH
        this.addEventListener('touchstart', e => this.emit('touchstart', e))
        this.addEventListener('touchend', e => this.emit('touchend', e))
        this.addEventListener('touchmove', e => this.emit('touchmove', e))
        this.addEventListener('touchcancel', e => this.emit('touchcancel', e))
      }

      connectedCallback (e) {
        this.emit('connected', e)
      }

      disconnectedCallback (e) {
        this.emit('disconnected', e)
      }

      initShadowDOM () {
        var self = this

        this.createShadowRoot()
        this.shadow = this.shadowRoot
        this.shadow.append(document.createElement('content'))
        var s = document.createElement('style')
        this.shadow.append(s)
        s.setAttribute('scope', 'shadow-stylesheet')
        s.append(document.createTextNode(''))

        this.shadow.stylesheet = new Dunno.UI.ShadowStyleSheet(this)
        this.shadowStyle = this.shadow.stylesheet.rules

        this.shadowStyle.display = 'block'
      }

      on (e, cb) {
        if (!this._events) this._events = {}
        if (!this._events.hasOwnProperty(e)) this._events[e] = []
        this._events[e].push(cb)
      }

      once (e, cb) {
        cb.once = true
        this.on(e, cb)
      }

      emit (e) {
        var self = this
        // we use a timeout to make the call async, because we don't have to wait for cb to return
        setTimeout(() => {
          if (!self._events) self._events = {}
          if (self._events.hasOwnProperty(e)) {
            var args = Array.prototype.slice.call(arguments)
            args.splice(0, 1)

            self._events[e].map((cb) => {
              if (!cb._once) cb.apply(self, args)
              if (cb.once) cb._once = true
            })
          }
        }, 0)
      }

      set template (name) {
        if (!!this.innerHTML) console.warn('Replacing existing elements')
        this.innerHTML = ''
        this.append(Dunno.UI._templates[name].cloneNode(true))
      }

      get text () {
        return this.textContent
      }

      set text (value) {
        return this.textContent = '' + value + ''
      }
  }

  window.customElements.define('base-view', Dunno.UI.BaseView)
})()
