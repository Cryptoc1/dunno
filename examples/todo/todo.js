;((undefined) => {

  window.Todo =
    class extends Dunno.Application {
      constructor () {
        super()

        this.title = 'Todo'

        this.createRegion()
        this.createHeader()
        this.createActionBar()
        this.createList()

        this.main()
      }

      createActionBar () {
        var actions = this.actions = new Todo.UI.ActionBar({
          id: 'actions'
        })

        this.region.append(actions)
      }

      createHeader () {
        var header = this.header = Dunno.UI.fromTemplate('header')
        this.region.append(header)
      }

      createList () {
        var list = this.list = new Dunno.UI.ListView({
          id: 'items'
        })

        this.region.append(list)
      }

      createRegion () {
        var region = this.region = new Dunno.UI.RegionView({
          id: 'primary-region'
        })

        this.view.append(region)
      }

      main () {
        for (var i = 0; i < 5; i++) {
          var item = new Todo.UI.TodoListItem({
            title: i
          })

          this.list.add(item)
        }
      }
  }

  Todo.Helpers.hexToRgba = hex => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b
    })

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
})()
