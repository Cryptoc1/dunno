;(() => {

  class Nazca extends Dunno.Application {
    constructor () {
      super()

      var self = this

      this._isNightTime = false

      this.createHelpBox()

      this.createTextArea()
      // this.textArea.addEventListener('change', this.textChanged)

      this.createPreviewArea()

      this.on('sunset-loaded', () => {
        self.toggleNightTime()
      })
      this.loadSunset()

      this.on('ctrl+shift+h', (e) => {
        self.helpBox.toggle()
      })

      this.on('ctrl+alt+n', (e) => {
        self.toggleNightTime()
      })

      this.on('ctrl+alt+p', (e) => {
        self.preview.toggle()
      })

      this.on('ctrl+o', (e) => {
        // self.open()
      })
    }

    close (e) {
      super.close(e)

      if (this.textArea.value.trim().length > 0) {
        this.store.set('editor-content', this.textArea.value)
      }

    // return a value to block the window from being unloaded
    // return true
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
      this.view.appendChild(btn)

      // HelpBox is a sub-class (custom element) of HTMLDivElement
      this.helpBox = new HelpBox()
      this.view.appendChild(this.helpBox)
    }

    createPreviewArea () {
      var p = this.preview = new PreviewArea()
      p.attach(this.textArea)
      this.view.appendChild(p)
    }

    createTextArea () {
      var self = this

      // TextArea is a sub-class (custom element) of HTMLDivElement, we're using a constructor to create the element
      var t = this.textArea = new TextArea()
      t.id = 'editor'
      t.className = 'editor'

      this.store.get('editor-content', (err, value) => {
        t.value = value || self.defaultText
      })

      // append to the master view
      this.view.appendChild(t)
    }

    get defaultText () {
      return `# Welcome to Nazca Writer\nHello, and welcome to Nazca Writer, an online clone of iA Writer (Copy. [**Information Architects Inc.**](http://ia.net))!\nThere are a lot of shortcuts and other features to help you work faster, for example, to view this Markdown file as live HTML, press *CTRL + ALT + P* (You may have to press it twice the first time, it's still a little buggy). A list of all commands for features like downloading and opening files can found in the Help dialog. Accessing the Help dialog is as simple as clicking the question mark in the top-right corner of the screen, or using the key combination *CTRL + SHIFT + H*. Nazca Writer as allows basic editing features found in most text editors using their corresponding system key combination, such as *CTRL + V* to paste in Windows or Chrome OS, and *CMD + V* in Mac OS. One last bit of information I should touch on is Night Mode, which changes the Ui to make it easy to edit documents in darker settings. Night Mode can be toggled using the key combination *CTRL + ALT + N*.\nEnjoy!\n\n-- Samuel Steele (cryptoc1)`
    }

    loadSunset () {
      var self = this
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          var date = new Date()
          var times = SunCalc.getTimes(date, position.coords.latitude, position.coords.longitude)
          if (date.getHours() >= times.sunset.getHours() | date.getHours() <= times.sunrise.getHours()) self._isNightTime = true
          self.emit('sunset-loaded')
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

      this.textArea.focus()
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

// TextArea

;((undefined) => {

  class TextArea extends HTMLDivElement {
    createdCallback () {
      this.style.width = '600px'
      this.style.height = '200px'
      this.contentEditable = true

      this.changeTimeout = null
      this._textContent = ''
      this.addEventListener('keydown', this.keydown)
      this.addEventListener('keyup', this.keyup)
    }

    keydown (e) {
      this.resetChangeTimeout()
    }

    keyup (e) {
      var self = this

      this.changeTimeout = window.setTimeout(() => {
        if (self.textContent !== self._textContent) {
          var changeEvent = new CustomEvent('change', {
            cancelable: true
          })
          self.dispatchEvent(changeEvent)
          if (changeEvent.defaultPrevented) {
            self.textContent = self._textContent
          }
        }
        self._textContent = self.textContent
        self.resetChangeTimeout()
      }, 500)
    }

    resetChangeTimeout () {
      window.clearTimeout(this.changeTimeout)
      this.changeTimeout = null
    }

    get value () {
      var text = this.innerHTML.replace(/<div><br><\/div>/g, '\n')
      text = text.replace(/(<div>)/g, '\n')
      text = text.replace(/(<\/div>)/g, '')
      text = text.replace(/(<br>)/g, '\n')
      return text.trim()
    }

    set value (value) {
      var html = value.trim().replace(/\n/g, '<div><br></div>')
      this.innerHTML = html
    }
  }

  window.TextArea = document.registerElement('text-area', TextArea)
})()

;((undefined) => {

  class HelpBox extends HTMLDivElement {

    createdCallback () {
      this.id = 'help-box'
      this.className = 'hidden'

      this.innerHTML = `
          <i id="exit" class="fa fa-close" onclick="((el, e) => { console.log(el.parentNode.hide() ) })(this, event)"></i>
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

  window.HelpBox = document.registerElement('help-box', HelpBox)
})()

;((undefined) => {

  class PreviewArea extends HTMLDivElement {
    createdCallback () {
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

  window.PreviewArea = document.registerElement('preview-area', PreviewArea)
})()
