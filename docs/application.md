# Application
Where it all begins...

### `Dunno.Application` extends `Dunno.Core.EventEmitter`

#### Methods
+ `.async(task: Function, callback: Function)` : Wrapper around `window.setTimeout|window.setImmediate`
+ `.close(e: Event|Object|undefined)` : Triggered by `window.onbeforeunload`, or manually via `myApp.close()`
+ `.init()` : Called by the constructor to bind events, prepare the DOM, etc
+ `.render()` : Renders the application's master view to the DOM

#### Properties
+ `static .Models: Object` : A static namespace for the models an application will use
+ `.name: String` : The name of application (default: `constructor.name`)
+ `.settings: Dunno.Core.SettingsContext` : The application's `SettingContext`
+ `.store: Dunno.Core.StorageContext` : The application's `StorageContext`
+ `.title: String` : A reference to the page's title
+ `.view: Dunno.UI.MasterView` : The application's master view
+ `static .UI: Object` : A static namespace for the views an application will use

#### Events
+ `beforeunload`
+ `close`
+ `keydown`
+ `<KEY_SHORTCUT>` : A special event that allows binding to specific keyboard shortcuts (e.g. `myApp.on('ctrl+alt+p`, ...)`)
+ `rendered`
