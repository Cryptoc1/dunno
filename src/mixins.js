;((undefined) => {

  Dunno.Mixins.extend = (base, mixin) => {
    var proto = {}
    Object.getOwnPropertyNames(mixin.prototype).map(key => base.prototype[key] = mixin.prototype[key])
  }

  Dunno.Mixins.mix = (superclass) => new MixinBuilder(superclass)

  Dunno.Mixins.merge = (...mixins) => {
    var superclass = function () {}
    var proto = mixins.reduce((c, m) => {
      Object.getOwnPropertyNames(m.prototype).map(key => c[key] = m.prototype[key])
      var deepestProto = m
      for (var p = Object.getPrototypeOf(deepestProto); p != Object.prototype && p != Function.prototype; p = Object.getPrototypeOf(deepestProto)) {
        console.log(Object.getOwnPropertyNames(p))
        Object.getOwnPropertyNames(p).map(key => {
          console.log('p.' + key)
          c[key] = p[key]
        })
        deepestProto = p
      }
      return c
    }, {})
    superclass.prototype = proto
    return superclass
  }

  var MixinBuilder = Dunno.Mixins.Builder =
    class {
      constructor (superclass) {
        this.superclass =
          class extends superclass {
        }
      }

      with (...mixins) {
        return mixins.reduce((c, m) => {
          var proto = {}
          Object.getOwnPropertyNames(m.prototype).map(key => proto[key] = m.prototype[key])

          // var deepestProto = Object.getPrototypeOf(c)

          // for (var p = Object.getPrototypeOf(deepestProto); p != Object.prototype && p != Function.prototype; p = Object.getPrototypeOf(deepestProto)) deepestProto = p

          var oProto = Object.getPrototypeOf(c)

          console.log(oProto)

          Object.setPrototypeOf(c, proto)

          return c
        }, this.superclass)
      }

  }
})()
