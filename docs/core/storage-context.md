# Storage Contexts
In Dunno, data an application can use/manipulated is managed through a storage context (or a class that implements `Dunno.Core.IStore`).
Dunno provides three built-in classes for managing data:
+ `Dunno.Core.StorageContext` is a high-level class that abstracts and implementation of `IStore`, in order to provide an isolated context within its store's context.
+ `Dunno.Core.IndexStore` is an implemnetation of `IStore` that encapsulates requests to a IndexedDB context.
+ `Dunno.Core.LocalStore` is an implementation of `IStore` that encapsulates requests to a localStorage context.

### `Dunno.Core.StorageContext(options: Object)` extends `Dunno.Core.EventEmitter`
A `StorageContext` provides an isolated context on-top of a `Dunno.Core.IStore` implementation.

#### Options

#### Methods
+ `.clear(callback: Function => (err))` : Deletes all keys that belong to the context from the store
+ `.get(key: String, callback: Function => (err, value))` : Get an object from the store
+ `.keyize(key: String) -> String` : Combines the context's prefix and name with `key` to create a key that a store can use
+ `.set(key: String, value: Object, callback: Function => (err, value))` : Set the value for an object in the store
+ `.size(callback: Function => (err, size))` : Get the size, in KiloBytes that the context uses

#### Properties
+ `.keys: Object` : An object that can be used as an enum for keys a context uses (e.g `store.key.notes = 'notes'; store.get(store.keys.notes, ...`)
+ `.name: String` : The name of the context
+ `.store: Dunno.Core.IStore` : A reference to the `IStore` that the context uses
