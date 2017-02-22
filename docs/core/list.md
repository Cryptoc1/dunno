# List

## `Dunno.Core.List(base: Array|List)` extends `Array`
A List is a sub-class of Array, to provide additional functionality, and a more convenient API.

### Methods
+ `.add(item: Object) -> Integer` : Adds `item` to the list, returning the index of the item.
+ `.each(callback: Function => (item: Object, index: Integer))` : Iterates over the list's items
+ `.insert(index: Integer, item: Object) -> Integer` : Inserts `item` into the list at index, `index`, returning the new length of the list
+ `static .isList(object: Object) -> Boolean` : Returns whether `object` is a List
