;((undefined) => {
  class NoteApp extends Dunno.Application {
    constructor () {
      super()

      this.title = 'Notes Example App'

      this.createSidebar()
      this.createEditor()

      /*this.on('ctrl+n', e => {
        this.newNote()
      })*/

      this.main()
    }

    close (e) {
      super.close(e)

      if (this.editor && this.editor.model) this.editor.model.save((err, res) => console.log(err, res))
    }

    createActionBar () {
      var actionBar = this.actionBar = new NoteApp.UI.ActionBar({
        id: 'actions'
      })

      var newNoteAction = new NoteApp.UI.ActionItem({
        id: 'new-note',
        icon: 'plus'
      })

      newNoteAction.on('click', e => this.newNote())

      actionBar.add(newNoteAction)

      this.notesRegion.append(actionBar)
    }

    createSidebar () {
      var region = this.notesRegion = new Dunno.UI.RegionView({
        id: 'notes-region'
      })
      this.view.append(region)

      var list = this.notesList = new Dunno.UI.ListView({
        id: 'notes-list'
      })
      region.append(list)

      this.createActionBar()
    }

    createEditor () {
      var region = this.editorRegion = new Dunno.UI.RegionView({
        id: 'editor-region'
      })

      var editor = this.editor = new NoteApp.UI.EditorView({
        id: 'editor',
        disabled: true,
        editable: false
      })

      region.append(editor)

      this.view.append(region)
    }

    main () {
      /*for (var i = 0; i < 26; i++) {
        var item = new Dunno.UI.ListItem('item ' + i)
        item.title = 'item ' + i
        item.textContent = 'item ' + i
        this.notesList.add(item)
      }*/

      this.store.get('notes', (err, notes) => {
        if (!err) {
          if (!notes) notes = NoteApp.NOTES_STORE_LAYOUT

          notes.keys.map(id => {
            var note = new NoteApp.Models.Note(notes.values[id], this.store)
            this.newNote(note)
          })
        } else {
          console.error('error reading the StorageContext', err)
        }
      })
    }

    static get NOTES_STORE_LAYOUT () {
      return {
        keys: [ /* array of note ids */ ],
        values: { /* dictionary of notes, keyed by their ID (that's stored in `values`) */ }
      }
    }

    newNote (model) {
      var item = new NoteApp.UI.NoteListItem({
        title: (model && model.get('title')) || 'New Note',
        model: model || new NoteApp.Models.Note({}, this.store)
      })

      // Bind the item's title to the note's title
      item.model.on('change', e => {
        if (e.attribute == 'title') item.title = e.value
      })

      item.on('connected', e => {
        // fade-in, once the element is attached to the DOM
        item.style.opacity = 1

        item.selected = true
        this.editor.model = item.model
        this.editor.editable = true
        this.editor.focus()
      })

      item.on('click', e => {
        item.selected = true
        this.editor.model = item.model
        this.editor.editable = true
        this.editor.focus()
      })

      this.notesList.add(item)
    }

    render () {
      super.render()
    }
  }

  window.NoteApp = NoteApp
})()

// EditorView

;((undefined) => {

  // We sub-class the text view, so that we can define custom model bindings
  NoteApp.UI.EditorView =
    class extends Dunno.UI.TextView {
      constructor (options = {}) {
        super(options)

        // bind editor change to model's text
        this.on('change', e => {
          if (!this.model) return
          this.model.set('text', this.value)
        })
      }

      get model () {
        return this._model
      }

      set model (value) {
        if (!(value instanceof Dunno.Core.IModel)) throw new TypeError('value for model must implement Dunno.Core.IModel')

        if (this._model) {
          this._model.save((err, res) => {
            this.value = value.get('text')
            this._model = value
          })
        } else {
          this._model = value
          this.value = value.get('text')
        }
      }
  }

  window.customElements.define('editor-view', NoteApp.UI.EditorView)
})()

// ActionBar

;((undefined) => {
  NoteApp.UI.ActionBar =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)

        this.items.map(item => this.append(item))
      }

      add (item) {
        this.append(item)
        return this.items.add(item)
      }

      get items () {
        return this._items || (this._items = new Dunno.Core.List())
      }

      set items (value) {
        if (!Dunno.Core.List.isList(value)) throw new TypeError('value must be of type Dunno.Core.List')
        this._items = value
      }
  }

  window.customElements.define('action-bar', NoteApp.UI.ActionBar)
})()

// ActionBarItem

;((undefined) => {

  /*
    ActionBarItem is a wrapper around a font-awesome icon
  */
  NoteApp.UI.ActionItem =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)

        this.shadow.style.append(document.createTextNode(':host { cursor: pointer; display: inline-block; }'))

        this.classList.add('fa')
      }

      set icon (value) {
        this.classList.add('fa-' + value)
      }
  }

  window.customElements.define('action-item', NoteApp.UI.ActionItem)
})()

// Note Model

;((undefined) => {
  NoteApp.Models.Note =
    class Note extends Dunno.Core.Model {
      constructor (attributes = {} , store) {
        super(attributes)

        this.attributes = Object.assign({
          created: Date.now(),
          updated: Date.now(),
          text: '',
          title: ''
        }, this.attributes)

        this.store = store
        if (!this.store) console.warn('No storage context has been set, .save(), .sync(), and .destroy() may not work as expected.')

        // set custom binding to update the title to the first line of the note's text
        this.on('change', e => {
          if (e.attribute === 'text') {
            var text = this.get('text')
            var end = text.indexOf('\n')
            var title = text.substring(0, (end < 0) ? text.length : end)
            if (!title || (title && title === '')) title = 'New Note'
            return this.set('title', title)
          }
          this.save()
        })
      }

      save (callback) {
        // create
        if (!this.get('id')) {
          this.id = NoteApp.Models.Note.guid()
          this.set('id', this.id)
        }

        this.attributes.updated = Date.now()

        this.store.get('notes', (err, notes) => {
          if (!err) {
            if (!notes) notes = NoteApp.NOTES_STORE_LAYOUT

            if (!notes.keys.includes(this.id)) notes.keys.push(this.id)
            notes.values[this.id] = this.attributes

            return this.store.set('notes', notes, callback)
          } else {
            return callback(err)
          }
        })
      }

      static guid () {
        function s4 () {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
      }
  }
})()

;((undefined) => {

  NoteApp.UI.NoteListItem =
    class extends Dunno.UI.ListItem {
      constructor (options = {}) {
        super(options)

        // bootsrapped for fade-in animation
        this.style.opacity = '.45'

        this.shadow.style.append(document.createTextNode(':host { cursor: pointer; }'))

        if (!this._title) this.append(this._title = new NoteApp.UI.NoteListItemTitle())
        if (!this._body) this.append(this._body = new NoteApp.UI.NoteListItemBody())
      }

      get body () {
        return this._body.innerHTML
      }

      set body (value) {
        if (!this._body) this.append(this._body = new NoteApp.UI.NoteListItemBody())
        this._body.innerHTML = value
      }

      get title () {
        return this.getAttribute('title')
      }

      set title (value) {
        if (!this._title) this.append(this._title = new NoteApp.UI.NoteListItemTitle())
        this.setAttribute('title', value)
        this._title.innerHTML = value
      }
  }

  window.customElements.define('notes-list-item', NoteApp.UI.NoteListItem)
})()

;((undefined) => {

  NoteApp.UI.NoteListItemTitle =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)
      }
  }

  window.customElements.define('notes-list-item-title', NoteApp.UI.NoteListItemTitle)
})()

;((undefined) => {

  NoteApp.UI.NoteListItemBody =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)
      }
  }

  window.customElements.define('notes-list-item-body', NoteApp.UI.NoteListItemBody)
})()
