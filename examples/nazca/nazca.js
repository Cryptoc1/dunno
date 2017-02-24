;(() => {

  class Nazca extends Dunno.Application {
    constructor () {
      super()

      this._isNightTime = false

      this.createHelpBox()

      this.createEditor()
      // this.editor.addEventListener('change', this.textChanged)

      this.createPreviewArea()

      this.on('sunset-loaded', e => this.toggleNightTime())
      this.loadSunset()

      this.on('ctrl+shift+h', e => this.helpBox.toggle())

      this.on('ctrl+alt+n', e => this.toggleNightTime())

      this.on('ctrl+alt+p', e => this.preview.toggle())

      this.on('ctrl+o', e => {
        // self.open()
      })
    }

    close (e) {
      super.close(e)

      if (this.editor.value.trim().length > 0) {
        this.store.set('editor-content', this.editor.value)
      }

    // return a value to block the window from being unloaded
    return true
    }

    createHelpBox () {
      var self = this

      // create a button that toggles the actual box
      var btn = this.helpBoxButton = document.createElement('button')
      btn.id = 'help-btn'
      btn.type = 'button'
      btn.name = 'help'
      btn.textContent = '?'
      btn.addEventListener('click', () => {
        self.helpBox.toggle()
      })
      this.view.append(btn)

      // HelpBox is a sub-class (custom element) of HTMLDivElement
      this.helpBox = new Nazca.UI.HelpBox()
      this.view.append(this.helpBox)
    }

    createPreviewArea () {
      var p = this.preview = new Nazca.UI.PreviewArea()
      p.attach(this.editor)
      this.view.append(p)
    }

    createEditor () {
      // Editor is a sub-class (custom element) of HTMLDivElement, we're using a constructor to create the element
      var editor = this.editor = new Dunno.UI.TextView({
        id: 'editor'
      })
      this.store.get('editor-content').then(content => editor.value = content || this.defaultText)

      editor.on('change', e => this.store.set('editor-content', editor.value))

      // append to the master view
      this.view.append(editor)
    }

    get defaultText () {
      return `# Welcome to Nazca Writer
Hello, and welcome to Nazca Writer, an online clone of iA Writer (Copy. [**Information Architects Inc.**](http://ia.net))!
There are a lot of shortcuts and other features to help you work faster, for example, to view this Markdown file as live HTML, press *CTRL + ALT + P* (You may have to press it twice the first time, it's still a little buggy). A list of all commands for features like downloading and opening files can found in the Help dialog. Accessing the Help dialog is as simple as clicking the question mark in the top-right corner of the screen, or using the key combination *CTRL + SHIFT + H*. Nazca Writer as allows basic editing features found in most text editors using their corresponding system key combination, such as *CTRL + V* to paste in Windows or Chrome OS, and *CMD + V* in Mac OS. One last bit of information I should touch on is Night Mode, which changes the Ui to make it easy to edit documents in darker settings. Night Mode can be toggled using the key combination *CTRL + ALT + N*.
Enjoy!

-- Samuel Steele (cryptoc1)`
    }

    loadSunset () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          var date = new Date()
          var times = SunCalc.getTimes(date, position.coords.latitude, position.coords.longitude)
          if (date.getHours() >= times.sunset.getHours() | date.getHours() <= times.sunrise.getHours()) self._isNightTime = true
          this.emit('sunset-loaded')
        }, (err) => {
          window.alert('There was an error determining your current location. Some features on this site may not work as expected.')
        })
      } else {
        window.alert("Your browser doesn't seem to have GeoLocation enabled. Some features on this site may not work as expected.")
      }
    }

    get isNightTime () {
      if (!this._isNightTime) {
        this.loadSunset()
        return false
      }

      return this._isNightTime
    }

    render () {
      super.render()

      this.editor.focus()
    }

    toggleNightTime () {
      if (document.body.className.includes('nighttime')) {
        document.body.classList.remove('nighttime')
      } else {
        document.body.classList.add('nighttime')
      }
    }
  }

  window.Nazca = Nazca
})()

// HelpBox

;((undefined) => {

  Nazca.UI.HelpBox =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)

        this.id = 'help-box'
        this.className = 'hidden'

        this.innerHTML = `
          <i id="exit" class="fa fa-close" onclick="((el, e) => { el.parentNode.hide() })(this, event)"></i>
          <h2>Key Combinations</h2>
          <ul>
              <li>CTRL + SHIFT + H :: Toggle display of this help dialog</li>
              <li>CTRL + ALT + N :: Toggle <em>Night Mode</em>
              </li>
              <li>CTRL + ALT + P :: Toggle <em>Preview</em></li>
              <li>CTRL + O :: Open an existing file</li>
              <li>CTRL + D :: Download the open document</li>
          </ul>
      `
      }

      hide () {
        this.style.opacity = 0
        this.classList.add('hidden')
      }

      show () {
        var self = this
        this.classList.remove('hidden')
        this.style.top = ((window.innerHeight / 2) - (this.offsetHeight / 2)) + 'px'
        this.style.left = ((window.innerWidth / 2) - (this.offsetWidth / 2)) + 'px'
        setTimeout(() => {
          self.style.opacity = 1
        }, 0)
      }

      toggle () {
        if (this.className.includes('hidden')) {
          this.show()
        } else {
          this.hide()
        }
      }
  }

  window.customElements.define('help-box', Nazca.UI.HelpBox)
})()

;((undefined) => {

  Nazca.UI.PreviewArea =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)
        this.id = 'preview'
        this.className = 'hidden'
      }

      // attach the preview area to the specified element
      attach (elem) {
        this.elem = elem
      }

      set content (value) {
        this.innerHTML = marked(value)
      }

      hide () {
        var self = this
        this.content = ''
        this.style.opacity = 0
        setTimeout(() => {
          self.classList.add('hidden')
        }, 0)
      }

      show () {
        var self = this
        this.content = this.elem.value
        this.classList.remove('hidden')
        setTimeout(() => {
          self.style.opacity = 1
        }, 0)
      }

      toggle () {
        if (this.visible) {
          this.hide()
        } else {
          this.show()
        }
      }

      get visible () {
        return !this.className.includes('hidden')
      }
  }

  window.customElements.define('preview-area', Nazca.UI.PreviewArea)
})()
