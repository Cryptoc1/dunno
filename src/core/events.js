;((undefined) => { // EventEmitter: a class that emits events
  Dunno.Core.EventEmitter =
    class {
      on (e, cb) {
        if (!this._events) this._events = {}
        if (!this._events.hasOwnProperty(e)) this._events[e] = []
        this._events[e].push(cb)
      }

      once (e, cb) {
        cb.once = true
        this.on(e, cb)
      }

      one (e, cb) {
        if (!this._events) this._events = {}
        if (!this._events.hasOwnProperty(e)) this._events[e] = []
        this._events[e][0] = cb
      }

      emit (e) {
        var self = this
        // we use a timeout to make the call async, because we don't have to wait for cb to return
        setTimeout(() => {
          if (!self._events) self._events = {}
          if (self._events.hasOwnProperty(e)) {
            var args = Array.prototype.slice.call(arguments)
            args.splice(0, 1)

            self._events[e].map((cb) => {
              if (!cb._once) cb.apply(self, args)
              if (cb.once) cb._once = true
            })
          }
        }, 0)
      }

      // remove callbacks that have been invoked, and defined with once (a sort-of GC for the _listeners)
      clean () {}
  }

  // EventEmitter: a class that emits events (static version)
  Dunno.Core.EventEmitter.Static = Dunno.Core.StaticEventEmitter =
    class {
      static on (e, cb) {
        if (!this._events) this._events = {}
        if (!this._events.hasOwnProperty(e)) this._events[e] = []
        this._events[e].push(cb)
      }

      static once (e, cb) {
        cb.once = true
        this.on(e, cb)
      }

      static emit (e) {
        var self = this
        setTimeout(() => {
          if (!self._events) self._events = {}
          if (self._events.hasOwnProperty(e)) {
            var args = Array.prototype.slice.call(arguments)
            args.splice(0, 1)

            self._events[e].map((cb) => {
              if (!cb._once) cb.apply(self, args)
              if (cb.once) cb._once = true
            })
          }
        }, 0)
      }

      // remove callbacks that have been invoked, and defined with once (a sort-of GC for the _listeners)
      clean () {}
  }
})()

/*
// Scheduler: A Scheduler is a class Implemented ontop of an internal interval that manages Job[s]

;((undefined) => {
  Dunno.Core.Scheduler =
    class extends Dunno.Core.EventEmitter {
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
        job.scheduler = this
        this._queue.push(job)
      }

      get delay () {
        return this._delay
      }

      set delay (value) {
        if (this.initialized) console.warn("Setting the scheduler delay after it's been initialized doesn't do anything unless you call `.reset()`")
        var d = parseInt(value)
        if (Number.isNaN(d)) throw new TypeError('Delay must be an Integer')
        this._delay = d
      }

      init () {
        var self = this

        // ensure that we're starting from scratch
        if (this._interval != null || this.initialized) {
          this.reset()
        }

        this._interval = window.setInterval(() => {
          self._jobs = self._jobs.filter((job, index) => {

            // invoke the job, if needed
            if ((!job.disposed && !job._dispose) && job.mounted && (self._tick >= job.timing._tick + job.timing.hold)) {
              job.invoke()
              job.timing._tick = self._tick
            }

            // set job disposed
            if (!job.disposed && (job._dispose || self._tick >= job.timing.dispose)) {
              job.dispose()

              job._dispose = true
              job.disposed = true
              job.mounted = false

              job.emit('disposed')
            }

            return !job.disposed
          })

          self.update()
          self._tick++

          self.emit('tick', self.tick)
        }, this._delay)

        this.initialized = true
        this.emit('init')
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

        // dispose all jobs before reset
        this._queue.map(job => {
          job.dispose()
          job.emit('disposed')
        })

        this._jobs.map(job => {
          job.dispose()
          job.emit('disposed')
        })

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

        this.emit('updated')
      }
  }
})()

// Job: A Job is a wrapper for a function that is expected to be called over an interval (the Scheduler)
class Job extends EventEmitter {
  constructor (task, options = {}) {
    super()

    this._options = options

    var options = Object.assign({}, {
      mounted: true,
      timing: Object.assign({}, {
        tick: 0,
        hold: 0
      }, options.timing)
    }, options, {
      timing: Object.assign({}, {
        tick: 0,
        hold: 0
      }, options.timing)
    })

    this._dispose = false
    this.disposed = false

    // .mounted: specifies if the job should be "active" in the scheduler (if the job is mounted, it will be invoked, if not mounted, it won't)
    this.mounted = options.mounted

    this.name = options.name
    this.scheduler = null
    this.task = task.bind(this)
    this.timing = options.timing
    this.timing._tick = this.timing.tick
  }

  dispose () {
    if (this.disposed) return

    this._dispose = true
    this.disposed = true

    if (this.mounted) this.unmount()
    this.mounted = false
  }

  invoke () {
    this.task()
    this.emit('invoked')
  }

  mount () {
    this.mounted = true
    this.emit('mounted')
  }

  unmount () {
    this.mounted = false
    this.emit('unmounted')
  }
}

// EventDispatch: An EventDispatch is a special type of Job that invokes a filter to determine if a custom event should be emitted
class EventDispatch extends Job {
  constructor (options = {}) {
    if (!options['event'] || !options['filter']) throw new Error('event and filter are required options')

    super(_, options)

    this._options = options

    var options = Object.assign({
      recurring: true,
      // The context that the event should be emitted on
      context: Events
    }, options)

    this.context = options.context
    this.event = options.event
    this.recurring = options.recurring

    this.filter = {
      _once: false,
      invoke: options.filter.bind(this)
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

  static get initialized () {
    return this._initialized || false
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
}*/
