;((undefined) => {

  Todo.UI.TodoListItem =
    class extends Dunno.UI.ListItem {
      constructor (options = {}) {
        super(options)

        // this.createActions()

        // this.shadow.style.append(document.createTextNode(':host { background-color:  }'))

        this.shadowStyle.backgroundColor = ''

        this.insertAdjacentElement('afterbegin', this.completeAction = new Todo.UI.ActionItem({
          id: 'complete-btn',
          icon: 'check',
          onclick: e => {
            console.log(e)
          }
        }))

        if (!this._title) this.append(this._title = new Todo.UI.TodoItemTitle())
      }

      createActions () {
        var actions = this.actions = new Todo.UI.ActionBar()

        actions.style.display = 'inline-block'

        actions.add(new Todo.UI.ActionItem({
          id: 'complete-btn',
          icon: 'check',
          onclick: e => {
            console.log(e)
          }
        }))

        this.insertAdjacentElement('afterbegin', actions)
      }

      get title () {
        return this._title.text
      }

      set title (value) {
        value = '' + value + ''
        if (!this._title) this.append(this._title = new Todo.UI.TodoItemTitle())
        this._title.text = value
      }
  }

  window.customElements.define('todo-list-item', Todo.UI.TodoListItem)
})()

;((undefined) => {
  Todo.UI.TodoItemTitle =
    class extends Dunno.UI.BaseView {
      constructor (options = {}) {
        super(options)

        this.shadowStyle.display = 'inline-block'
      }
  }

  window.customElements.define('todo-item-title', Todo.UI.TodoItemTitle)
})()
