'use babel'
import { List, Map } from 'immutable'
import { Glob, sync } from 'glob'
import path from 'path'

const QUERY_MIN_LENGTH = 1
const QUERY_SEP = '|'
const GIT_DIR = '.git'

class Cache {

    constructor () {
      this._cached = List()
      this._valid  = false
      this.options = {
        ignore: ['node_modules/**', ...this.getIgnoredNames()],
        cache: this.emitter,
        cwd: './',
      }
    }

    isValid () {
      return this._valid === true
    }

    getIgnoredNames () {
      // TODO
      return []
    }

    updateIndex (path, pattern) {

      return new Promise(resolve => {
        if (!path || !pattern)
          resolve(this.decorateOutput(List([])))

        this.options.cwd = path
        this._updatedTime = new Date().getTime()
        this.emitter = new Glob(
          pattern, this.options, (error, matches) => {
            return error && !matches ?
              resolve(this.handleException(error, matches, pattern)) :
              resolve(this.validateCache(matches, error))
          })
      })
    }

    updateSync (path, pattern) {
      if (!path || !pattern)
        return []
      this.options.cwd = path
      this._updatedTime = new Date().getTime()
      let result = sync(pattern, this.options)
      this.rawresults = result
      return this.validateCache(result)
    }

    validateCache (items=[], e=null) {
      this._cache = List(items.map(o =>
        Map({
          extension: o.split('.').pop(),
          name: o.split('/').pop(),
          path: o,
          scope: List(o.split('/')),
        }))
      )
      if (this._cache.size)
        this._valid = true
      return this
    }

    handleException (message, ...details) {
      console.error("Exception in file cache indexing\n", message, ...details)
      return this
    }

    items () {
      return this.resultSet || List([])
    }

    decorateOutput (items, ...args) {

      this.resultSet = List(items.map(o =>
        Map({
          extension: o.get('extension'),
          name: o.get('name'),
          path: o.get('path'),
        }))
      )
      if (!this.resultSet.size)
        return this.updateIndex(this.options.cwd, '**')
      return this
    }

    search (query=null) {
      if (!this.isValid())
        return this.updateSync(this.options.cwd, '**')

      // let items   = this.resultSet || this._cache
      let items   = this._cache
      let isEmpty = items.size === 0
      let isUnderRequiredLength = query.length < QUERY_MIN_LENGTH

      if (!query || isEmpty || isUnderRequiredLength)
        return this.decorateOutput(List())

      query = query.trim().replace(/\s/g, QUERY_SEP)
      query = query ? new RegExp(query, 'g') : '.*'
      items = items.filter(o => o.get('path').search(query) !== -1)
      return this.decorateOutput(items)
    }

    query(q=() => false) {
      return this.items().filter( o => q(o) ? true : false )
    }

    filter (flt={}) {
      let { type, query } = flt
      let filter
      if (!type)
        return this
      if (type === 'extension')
        filter = item => item.get('extension') === query
      let resp = this.query(filter)
      return this.decorateOutput(resp)
    }
}

let cache = new Cache()

export default function (path='.', query=null, ...filters) {
    console.warn("task args", arguments)
    let send = {
      result: (data, ...args) => emit('result', { data, args, path, query, filters })
    }
    let updater = cache.updateSync(path, '**')
    if (query) {
      cache.search(query)
      send.result(cache.items())
    }

    while (filters) {
      let filter = filters.pop()
      if (!filter)
        break
      cache.filter(filter)
    }
    // emit('result', { data: cache.items() })
    return cache
}
