;((dunno, undefined) => {

  class Application extends EventEmitter {
    constructor () {
      super()
      this.store = new StorageContext('dunno.app', this.constructor.name)
      this.view = new Dunno.MasterView()

      this.init()
    }

    init () {
      document.body.querySelectorAll('dunno-ignore').forEach((di) => {
        di.style.display = 'none'
      })

      // styling
      /*document.body.style.width = '100%'
      document.body.style.margin = '0'
      document.body.style.padding = '0'
      document.body.style.outline = 'none'
      document.body.style.border = 'none'*/

      // remove all DOM elements
      var ignored = document.body.querySelectorAll('body>:not(dunno-ignore)')
      ignored.forEach((el) => {
        el.remove()
      })

      // window title
      this._title = document.head.querySelector('title') || document.head.appendChild(document.createElement('title'))
      if (this.title === '') this.title = this.constructor.name
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
