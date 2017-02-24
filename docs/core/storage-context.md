# Storage Contexts

In Dunno, data an application can use/manipulated is managed through a storage context (or a class that implements `Dunno.Core.IStore`). Dunno provides three built-in classes for managing data:

- `Dunno.Core.StorageContext` is a high-level class that abstracts and implementation of `IStore`, in order to provide an isolated context within its store's context.
- `Dunno.Core.IndexStore` is an implemnetation of `IStore` that encapsulates requests to a IndexedDB context.
- `Dunno.Core.LocalStore` is an implementation of `IStore` that encapsulates requests to a localStorage context.

### `Dunno.Core.StorageContext(options: Object)` extends `Dunno.Core.EventEmitter`

A `StorageContext` provides an isolated context on-top of a `Dunno.Core.IStore` implementation.

#### Options

- `.name: String` : The name of the given context (is appended to the context's prefix to form a full namespace)
- `.prefix: String` : The prefix for the context to use
- `.store: Dunno.Core.IStore` : A reference to an implementation of `Dunno.Core.IStore`

#### Methods

- `.clear() -> Promise` : Deletes all keys that belong to the context from the store
- `.get(key: String) -> Promise` : Get an object from the store
- `.keyize(key: String) -> String` : Combines the context's prefix and name with `key` to create a key that a store can use
- `.set(key: String, value: Object) -> Promise` : Set the value for an object in the store
- `.size() -> Promise` : Get the size, in KiloBytes that the context uses

#### Properties

- `.keys: Object` : An object that can be used as an enum for keys a context uses (e.g `store.key.notes = 'notes'; store.get(store.keys.notes, ...`)
- `.name: String` : The name of the context
- `.store: Dunno.Core.IStore` : A reference to the `IStore` that the context uses

### `Dunno.Core.IStore`

This interface defines methods that a store should implement to be compatible with `Dunno.Core.StorageContext`.

#### Methods

- `.clear() -> Promise` : Deletes all keys in the store
- `.get(key: String) -> Promise` : Get an object from the store
- `.set(key: String, value: Object) -> Promise` : Set the value for an object
- `.size() -> Promise` : Get the size, in KiloBytes the store uses

### `Dunno.Core.IndexStore` extends `Dunno.Core.IStore`

This is an implementation of `Dunno.Core.IStore` that provides access to a KVP table within the browser's IndexedDB through an easy-to-use API.

#### Methods

- `.open() -> Promise` : Opens a connection to IndexedDB

#### Properties

- `.dbName: String` : The name of the database (default: `KVPStore`)
- `.storeName: String` : The name of the IndexedDB store used (default: `kvp`)

### `Dunno.Core.LocalStore` extends `Dunno.Core.IStore`

This implementation of `IStore` provides an asynchronous API for `localStorage`.
