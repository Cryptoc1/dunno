# Events

### `Dunno.Core.EventEmitter`
It emits events

#### Methods
+ `.on(event: String, callback: Function => ([arg1, arg2, arg3, ...]))` : Sets a listener, `callback`, for every trigger of the event, `event`
+ `.once(event: String, callback: Function => ([arg1, arg2, arg3, ...]))` : Sets a listener, `callback`, for the next trigger of the event, `event`
+ `.one(event: String, callback: Function => ([arg1, arg2, arg3, ...]))` : Sets the listener, `callback`, for every trigger of the event, `event`
+ `.emit(event: String[, arg1, arg2, arg3, ...])` : Emits/Triggers the event, `event`
