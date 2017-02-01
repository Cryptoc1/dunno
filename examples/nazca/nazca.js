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

      // create a keydown listener to handle app keyboard shortcuts
      // @TODO: make event for Application class to handle keyboard shortcuts
      window.addEventListener('keydown', (e) => {
        self.keydown(e)
      })
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
      // TextArea is a sub-class (custom element) of HTMLDivElement, we're using a constructor to create the element
      var t = this.textArea = new TextArea()
      t.id = 'editor'
      t.className = 'editor'

      // append to the master view
      this.view.appendChild(t)
    }

    get defaultText () {
      return 'Hello world!'
    }

    keydown (e) {
      switch (e.keyCode) {
        case 68:
          // download
          break
        case 72:
          if (e.ctrlKey && e.shiftKey) {
            e.preventDefault()
            this.helpBox.toggle()
          }
          break
        case 78:
          if (e.ctrlKey && e.altKey) {
            e.preventDefault()
            this.toggleNightTime()
          }
          break
        case 79:
          // open file
          break
        case 80:
          // preview markdown
          if (e.ctrlKey && e.altKey) {
            e.preventDefault()
            this.preview.toggle()
          }
          break
      }
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

      if (this.store.get('auto-nightmode') && this.isNightTime) this.toggleNightTime()
    }

    textChanged (e) {
      console.log(e.target.textContent)
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
      return this.innerHTML
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
      this.classList.remove('hidden')
      this.style.top = ((window.innerHeight / 2) - (this.offsetHeight / 2)) + 'px'
      this.style.left = ((window.innerWidth / 2) - (this.offsetWidth / 2)) + 'px'
      this.style.opacity = 1
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
      value = value.replace(/<div><br><\/div>/g, '\n')
      value = value.replace(/(<div>)/g, '\n')
      value = value.replace(/(<\/div>)/g, '')
      this.innerHTML = marked(value)
    }

    hide () {
      this.content = ''
      this.style.opacity = 0
      this.classList.add('hidden')
    }

    show () {
      this.content = this.elem.value
      this.classList.remove('hidden')
      this.style.opacity = 1
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
