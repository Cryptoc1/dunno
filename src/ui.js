// UI

;((undefined) => {
  Dunno.UI =
    class {
      static loadTemplates () {
        // the browser should be caching the requests, so we shouldn't have to worry about that, so just scrape the content
        this._templates = {}

        var imports = document.head.querySelectorAll('link[rel="import"][scope="dunno-template"]')

        for (var i = 0; i < imports.length; i++) {
          var link = imports[i]
          var name = link.getAttribute('name')

          var template = link.import.querySelector('template#' + name)

          this._templates[name] = document.importNode(template.content, true)
        }
      }

      static fromTemplate (templateName, nodeName = templateName) {
        var node = document.createElement(nodeName)
        node.append(this._templates[templateName].cloneNode(true))
        return node
      }
  }

  Dunno.UI.loadTemplates()
})()
