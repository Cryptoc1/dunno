# Models
A model is an object that encapsulates data your application can use/manage. A model wraps/encapsulates attributes, which is represented by a regular JavaScript Object, and provides methods for managing those attributes.

### `Dunno.Core.IModel` extends `Dunno.Core.EventEmitter`
This interface defines methods that Models should implement.

#### Methods
+ `.clone() -> Dunno.Core.IModel` : Returns a copy of the model
+ `.destroy(callback: Function => (err, res))` : Removes the model from its storage context
+ `.get(attribute: String) -> Object` : Get a model's attribute
+ `.save(callback: Function => (err, res))` : Saves the model to its storage context
+ `.set(attribute: String, value: Object)` : Set the value for a model's attribute
+ `.sync(callback: Function => (err, res))` : Sync a model's attributes with those found in its storage context

### `Dunno.Core.Model(attributes: Object)` extends `Dunno.Core.IModel`
This is a generic definition of `Dunno.Core.IModel` that supports attribute getting/setting and cloning, but does not support methods that would require a storage context (e.g. `.destroy()`, `.save()`, `.sync()`)

#### Methods
+ `static .guid() -> String` : Generates a UUID string

#### Events
+ `change` : Emitted when an attribute is changed via `.set()`
