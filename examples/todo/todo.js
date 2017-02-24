;((undefined) => {

  window.Todo =
    class extends Dunno.Application {
      constructor () {
        super()

        this.title = 'Todo'

        this.createRegion()
        this.createHeader()
        this.createList()
      }

      createHeader() {
        var header = this.header = document.createElement('header')

        header.innerHTML = `
          <div id="title">TODO</div>
          <div id="catchline">What needs doing, sir?</div>
        `
        this.region.append(header)
      }

      createList() {
        var list = this.list = new Dunno.UI.ListView({
          id: 'items'
        })
        list.innerHTML = 'asd'

        this.region.append(list)
      }

      createRegion() {
        var region = this.region = new Dunno.UI.RegionView({
          id: 'primary-region'
        })

        this.view.append(region)
      }
  }
})()
