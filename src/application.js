;((undefined) => {

  class Application extends Dunno.Core.EventEmitter {
    constructor () {
      super()

      this.settings = new Dunno.Core.SettingsContext('dunno.app', this.name)

      this.store = new Dunno.Core.StorageContext({
        prefix: 'dunno.app',
        name: this.name,
        store: 'IndexedDB'
      })

      this.view = new Dunno.UI.MasterView()

      this.init()
    }

    async (task, callback = new Function()) {
      var fn = (() => {
        return callback(task())
      }).bind(task)
      return (window.setImmediate) ? window.setImmediate(fn) : window.setTimeout(fn, 0)
    }

    close (e) {
      this.emit('close', e)
    }

    init () {
      var self = this

      document.body.querySelectorAll('dunno').forEach((el) => {
        el.style.display = 'none'
      })

      this.bindEvents()

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
    }

    bindEvents () {
      window.addEventListener('keydown', e => this.emit('keydown', e))
      window.addEventListener('keydown', e => this.onKeydown(e))
      window.addEventListener('beforeunload', e => {
        var r = this.close(e)
        if (r) return e.returnValue = true
      })
      window.addEventListener('beforeunload', e => this.emit('beforeunload', e))
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

  Application.Models = {}
  Application.UI = {}

  window.Dunno.Application = Application
})()
