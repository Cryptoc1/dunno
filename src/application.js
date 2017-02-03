;((dunno, undefined) => {

  class Application extends EventEmitter {
    constructor () {
      super()

      this.settings = new SettingsContext('dunno.app', this.name)

      this.store = new StorageContext({
        prefix: 'dunno.app',
        name: this.name,
        store: 'IndexedDB'
      })

      this.view = new Dunno.MasterView()

      this.init()
    }

    close (e) {
      this.emit('close')
    }

    init () {
      var self = this

      document.body.querySelectorAll('dunno').forEach((el) => {
        el.style.display = 'none'
      })

      // styling
      /*document.body.style.width = '100%'
      document.body.style.margin = '0'
      document.body.style.padding = '0'
      document.body.style.outline = 'none'
      document.body.style.border = 'none'*/

      // remove all DOM elements
      var ignored = document.body.querySelectorAll('body>:not(dunno)')
      ignored.forEach((el) => {
        el.remove()
      })

      // window title
      this._title = document.head.querySelector('title') || document.head.appendChild(document.createElement('title'))
      if (this.title === '') this.title = this.constructor.name

      window.addEventListener('keydown', (e) => {
        self.onKeydown(e)
      })

      window.addEventListener('beforeunload', (e) => {
        var r = self.close(e)
        if (r) return e.returnValue = true
      })
    }

    onKeydown (e) {
      var keys = []
      if (e.ctrlKey) keys.push('ctrl')
      if (e.shiftKey) keys.push('shift')
      if (e.altKey) keys.push('alt')
      keys.push(String.fromCharCode(e.keyCode).toLowerCase())

      this.emit(keys.join('+'), e)
    }

    get name () {
      return this.constructor.name
    }

    render () {
      document.body.appendChild(this.view)
      this.view.focus()

      this.emit('rendered')
    }

    get title () {
      return this._title.text
    }

    set title (value) {
      this._title.text = value
    }
  }

  dunno.Application = Application

  window.Dunno = dunno
})(window.Dunno || {})
