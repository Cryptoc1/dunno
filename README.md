# Dunno

Dunno is small experiment with client JavaScript for applications.

## Getting Started

Dunno apps start by extending, or sub-classing `Dunno.Application`. The `Application` class provides abstraction to storage contexts (through IndexedDB and localStorage), a settings context through localStorage, and special key press handlers for application shortcuts.

To begin, last create our application class.

```javascript
class TutorialApp extends Dunno.Application {
  constructor() {
    super()

    /*
     Now we can setup anything we'll need for the app (event listeners, loading some dynamic content, create subviews, etc)
    */

    var self = this

    this.view.appendChild(this.editor = new EditorView())

    this.on('ctrl+shift+h', (e) => {
      e.preventDefault()
      self.editor.hide()
    })
  }

  // The close method is called
  close() {
    super.close.apply(this, arguments)

    this.store.set('editor.content', this.editor.value, (err, res) => {
      // do nothing
    })

    /*
      Returning a value that evaluates to `true` in an if statement will cause the application to wait for user feedback before exiting
      (based off of `window.onbeforeunload`'s behavior)
    */
    return true
  }

  /*
    Dunno.Application.render() will clear the existing DOM and append our master view (`this.view`),
    but we can do a little more, like focusing on a subview, or settings it's content from the store
  */
  render() {
    super.render() // required call to superclass

    var self = this

    // load the editor's contents from the store (this shouldn't actually be done in render though...)
    this.store.get('editor.content', (err, content) => {
      if (!err) {
        self.editor.value = history
        self.editor.focus()
      }
    })
  }
}
```

### Understanding Views

In Dunno, "Views" are just ES6 Custom elements (classes that extend `HTMLElement`, and family). For example, the editor subview that was used above could look something like this:

```javascript
// we use a IIFE for cleaner scoping when using document.registerElement to "export the view"
;((undefined) => {

  class EditorView extends HTMLDivElement {
    constructor() {
      super()
    }

    createdCallback() {
      this.value = "Hello World!"
    }

    hide() {
      this.style.display = 'none'
    }

    show() {
      this.style.display = 'block'
    }

    toggle() {
      if (!this.visible) {
        this.show()
      } else {
        this.hide()
      }
    }

    // we can use getter/setter for binding a value property to the Node's textContent
    get value() {
      return this.textContent
    }

    set value(value) {
      this.textContent = value
    }

    get visible() {
      return this.style.display !== 'none' && this.style.visibility !== 'hidden' && this.style.opacity > 0
    }
  }

  // "export" the element registered to our view class
  window.EditorView = document.registerElement('editor-view', EditorView)
})()
```

You can find more information about ES6 and custom elements on [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements/Custom_Elements_with_Classes)

In Dunno, all subviews are added to a master view to be rendered in the DOM. This master view is really just another custom element that's registered within `Dunno`. To add subviews to the master view, you simply append them like you would in good 'ol fashioned JavaScript, `this.view.appendChild(new EditorView())`.

### `Dunno.Application` and Events

`Dunno.Application` is an `EventEmitter` (not to be confused with the node.js class), which makes it easy to set listeners and trigger/emit events on a given class. From the `TutorialApp` example above, we used `.on()` to set a shortcut listener to hide the editor view. Keyboard shortcuts are just an example of how the `EventEmitter` makes it easy for an application to trigger and manage events for control flow.

### Putting it All Together

Now that we've defined our `Dunno.Application` sub-class, defined all of our views, it's time to put them to use. This is as simple as constructing a new instance of your `Application` class, and calling `.render()` when it should be added to the DOM.

```javascript
var app = window.app = new TutorialApp()

window.onload = () => {
  app.render()
}
```

There's a little bit more you could do to personalize this experience though.

```html
<html>
  <head></head>

  <body>

    <!-- This element will be removed when the Application renders, allowing you to customize the initial loading experience until the call to `.render()` -->
    <div class="spinner loading"></div>

    <dunno>
      <!-- Anything in a `dunno` element won't be removed from the DOM when the application renders -->

      <script src="path/to/dunno.js"></script>
      <script src="path/to/myapp.js"></script>

      <script>
        var app = window.app = new TutorialApp()

        window.onload = () => {
          app.render()
        }
      </script>

    </dunno>
  </body>
</html>
```
