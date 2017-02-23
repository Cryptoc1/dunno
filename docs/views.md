# Views

In Dunno, views are just ES6 custom elements. This makes them highly extensible and easy to use. Dunno provides a `BaseView` class for getting started with creating views, and also includes a few builtin views, such as a `ListView`, and a `TextView`.

## Model Bindings

One of the powerful options provided by using ES6 Custom Elements as views is simplicity in setting up bindings between a view and it's model. Take, for example, the Notes App. We created an `EditorView` which is a `TextView` for editing a notes text. In the `EditorView`'s constructor, we create a listener for the `change` event, and use it to update the model.

```javascript
// bind editor changes to model's text
this.on('change', e => {
  if (!this.model) return
  this.model.set('text', this.value)
})
```

Another powerful feature of using Custom Elements is debuggability. Where as in an environment like Backbone, Views are an abstracted JavaScript class that encapsulate a DOM Node and Model, Dunno makes it easy to inspect a views properties right from the element inspector of the browsers web tools. This means that any-old DOM query can expose your view's model, and custom properties or methods. This can make testing and debugging much easier. It also means that views can easily bind to any built-in features of a DOM Node.

## The MasterView

With Dunno, every Application has a `.view` property that references its master view. The master view is where your application will add al of its views, hence the name "master view". Because views are just custom elements, child views are added to the DOM using the familiar `.appendChild()`, or the preferred, updated `.append()` APIs.

## Using a View's ShadowRoot

Every view in Dunno has a ShadowRoot attached to it. The primary reasoning for this is style views without attaching the styles to the views `style` attribute. A view's ShadowRoot can be accessed through its `.shadow` property, and a reference to an embedded `style` element can be referenced using `.shadow.style`. Adding CSS rules for the view is done by appending text nodes the the shadow's style element. For example:

```javascript
class MyView extends Dunno.UI.BaseView {
  constructor(options = {}) {
    super(options)

    this.shadow.style.append(document.createTextNode(`
      :host {
        display: inline;
        border-radius: 3px;
      }
      `))
  }
}
```
