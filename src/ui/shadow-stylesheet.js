;((undefined) => {

  const STYLES = window.getComputedStyle(document.createElement('div'))

  Dunno.UI.ShadowStyleSheet =
    class {
      constructor (elem) {
        this.elem = elem

        if (!this.elem.shadowRoot) this.elem.createShadowRoot()
        var style = this.elem.shadowRoot.querySelector('style[scope="shadow-stylesheet"]')
        if (!style) {
          style = document.createElement('style')
          style.setAttribute('scope', 'shadow-stylesheet')
          style.append(document.createTextNode(''))
          this.elem.shadowRoot.append(style)
        }

        this.styleRoot = style

        this.cssText = ''

        var rules = this._rules = Object.assign({}, STYLES)
        Object.keys(rules).map(rule => {
          if (rules[rule] !== '') {
            this.cssText += rule + ': ' + rules[rule] + ';'
          }
        })

        this.rules = new Proxy(this._rules, {
          set: (target, property, value, receiver) => {
            var oldValue = target[property]

            if (oldValue == value) return true

            var oldRule = this.keyize(property, target[property])
            var newRule = this.keyize(property, value)

            if (oldValue !== '') {
              this.cssText = this.cssText.replace(oldRule, newRule)
            } else {
              this.cssText += newRule
            }

            target[property] = value

            this.setStyle()

            return true
          }
        })
      }

      keyize (rule, value) {
        return rule.replace(/[A-Z]/g, '-$&').toLowerCase() + ': ' + value + ';'
      }

      setStyle () {
        this.styleRoot.innerHTML = ':host { ' + this.cssText + ' }'
      }
  }
})()
