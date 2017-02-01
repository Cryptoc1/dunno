// EventEmitter: a class that emits events
class EventEmitter {
  on (e, cb) {
    if (!this._listeners) this._listeners = {}
    if (!this._listeners.hasOwnProperty(e)) this._listeners[e] = []
    this._listeners[e].push(cb)
  }

  once (e, cb) {
    cb.once = true
    this.on(e, cb)
  }

  emit (e) {
    var self = this
    // we use a timeout to make the call async, because we don't have to wait for cb to return
    setTimeout(() => {
      if (!self._listeners) self._listeners = {}
      if (self._listeners.hasOwnProperty(e)) {
        var args = Array.prototype.slice.call(arguments)
        args.splice(0, 1)

        self._listeners[e].map((cb) => {
          if (!cb._once) cb.apply(self, args)
          if (cb.once) cb._once = true
        })
      }
    }, 0)
  }

  // remove callbacks that have been invoked, and defined with once (a sort-of GC for the _listeners)
  clean () {}
}

// Scheduler: A Scheduler is a class Implemented ontop of an internal interval that manages Job[s]
class Scheduler extends EventEmitter {
  constructor (options) {
    super()
    options = this._options = Object.assign({
      delay: 100
    }, options)

    this._delay = options.delay
    this._jobs = []
    this._interval = null
    this._tick = 0
    this._queue = []
    this.initialized = false
  }

  add (job) {
    this._queue.push(job)
  }

  get delay () {
    return this._delay
  }

  set delay (value) {
    if (this.initialized) console.warn("Setting the scheduler delay after it's been initialized doesn't do anything unless you call `.reset()`")
    var d = parseInt(value)
    if (Number.isNaN(d)) throw new TypeError('Delay must be an Integer')
    this._delay = value
  }

  init () {
    var self = this

    // ensure that we're starting from scratch
    if (this._interval != null || this.initialized) {
      this.reset()
    }

    this._interval = window.setInterval(() => {
      self._jobs.map((job) => {
        if (self._tick > job.timing.tick + job.timing.hold) {
          job.invoke()
          job.timing.tick = self._tick
        }
      })

      self.update()
      self._tick++

      self.emit('tick', self.tick)
    }, this._delay)

    this.initialized = true
  }

  // merge the queue and jobs from another scheduler into this one, reseting the original scheduler
  merge (scheduler) {
    var self = this

    scheduler._queue.map((job) => {
      self._queue.push(job)
    })
    scheduler._jobs.map((job) => {
      self._queue.push(job)
    })

    scheduler.reset()
  }

  reset () {
    window.clearInterval(this._interval)
    this._interval = null

    this._queue = []
    this._jobs = []

    this._tick = 0

    this.initialized = false

    this.emit('reset')
  }

  // Moves jobs from the queue into the list of active jobs
  update () {
    var self = this

    if (this._queue.length > 0) {
      this._queue.map((job) => {
        self._jobs.push(job)
      })

      this._queue = []
    }
  }
}

// Job: A Job is a wrapper for a function that is expected to be called over an interval (the Scheduler)
class Job extends EventEmitter {
  constructor (task, options = {}) {
    super()

    options = this._options = Object.assign({}, options, {
      timing: Object.assign({}, {
        tick: 0,
        hold: 0
      }, options.timing)
    })

    this.name = options.name
    this.task = task
    this.timing = options.timing
  }

  invoke () {
    this.task()
    this.emit('invoked')
  }
}

// EventDispatch: An EventDispatch is a special type of Job that invokes a filter to determine if a custom event should be emitted
class EventDispatch extends Job {
  constructor (options = {}) {
    if (!options['event'] || !options['filter']) throw new Error('event and filter are required options')

    super(_, options)

    options = this._options = Object.assign({
      recurring: true,
      // The context that the event should be emitted on
      context: Events
    }, options)

    this.context = options.context
    this.event = options.event
    this.recurring = options.recurring

    this.filter = {
      _once: false,
      invoke: options.filter
    }

    var self = this

    function _ () {
      self._invoke()
    }
  }

  _invoke () {
    if (!this.filter._once) {
      if (this.filter.invoke() == true) {
        this.emitEvent()
        this.filter._once = true
      }
    } else {
      if (this.recurring == true) {
        if (this.filter.invoke() == true) {
          this.emitEvent()
        }
      }
    }
  }

  emitEvent () {
    this.context.emit(this.event)
    this.emit(this.event)
  }
}

// A static helper for managing custom events
class Events {
  static init () {
    this.emitter = new EventEmitter()

    if (this._scheduler) {
      console.warn('An existing scheduler is being overwritten. Did you call `.use()` or `get .scheduler()` before `.init()`?')
    }
    this.use(new Scheduler())
    this._scheduler.init()

    this._initialized = true
  }

  static on (e, cb) {
    if (!this.emitter) this.emitter = new EventEmitter()
    this.emitter.on(e, cb)
  }

  static emit (e) {
    if (!this.emitter) this.emitter = new EventEmitter()
    this.emitter.emit(e)
  }

  static get scheduler () {
    if (!this._scheduler) {
      this._scheduler = new Scheduler()
      this._scheduler.init()
    }
    return this._scheduler
  }

  // specify the scheduler to use for managing event dispatchs
  static use (scheduler, options = {}) {
    options = Object.assign({
      merge: true
    }, options)

    // if the scheduler already exists, reset it to stop any running jobs
    if (this._scheduler) {
      if (options.merge) scheduler.merge(this._scheduler)
      this._scheduler.reset()
    }

    this._scheduler = scheduler
  }
}
