'use babel'
import { Emitter, Task } from 'atom'
import { resolve } from 'path'
import { List, Map, fromJS } from 'immutable'

import { $ as shuttle } from 'space-pen'

const PKG_NAME = 'tree-view-filter'
const PROC_NAME = 'cache-index'
const PROJECT_ROOT_INDEX = 0

export const MESSAGE = {
  ON_RESULT: 'result',
  REQUEST_SEARCH: 'search',
  REQUEST_FILTER: 'filter',
}

const getProcPath = () =>
  resolve(atom.packages.getLoadedPackage(PKG_NAME).path, 'lib', 'proc', PROC_NAME + '.js')

let _cached = null, _instance

export default (opts={}) => {
  return _instance || new SearchResultsProvider(opts)
}

export class SearchResultsProvider extends Emitter {

  constructor (args={}) {
    super()
    this.task = new Task(getProcPath())
    this.path = atom.project.getPaths()[PROJECT_ROOT_INDEX]
    this.task.start(this.path, ' ')
    this.bindHandlers()
  }

  run (...args) {
    return this.task.start(this.path, ...args)
  }

  get () {
    console.warn("Fetchin caached datta")
    return _cached.data || []
  }

  bindHandlers () {
    this.task.on(MESSAGE.ON_RESULT, data => this.updateLocalCache(data))
    this.task.on(MESSAGE.ON_RESULT, data => this.broadcastResults(data))
  }

  updateLocalCache (data) {
    _cached = { ..._cached, ...data }
  }

  search (query) {
    this.broadcastResults(_cached)
    console.warn ("searching for", query)
    this.run(query)
  }

  toggleFilter (payload) {
    this.activeFilters = this.activeFilters || {}
    if (!this.activeFilters[payload.name])
      this.activeFilters[payload.name] = (...o) => payload.test(...o)
    else
      delete this.activeFilters[payload.name]
    this.broadcastResults(payload)
    return this.activeFilters
  }

  filter (items) {
    this.activeFilters = this.activeFilters || {}
    console.log("searchResult before for loop", items)
    console.log("activeFilters before for loop", this.activeFilters)
    for (let filter in this.activeFilters) {
      console.log(filter);
      items = items.filter(this.activeFilters[filter])
    }
    console.log("searchResult after for loop", items)
    return items
  }

  hideExcludedItems () {
    let entries = shuttle('.file.entry [data-path]', '.tree-view')
    let cached  = this.get()
    let visible = entries
      .filter((n, item) =>
      cached.find(o => o.name == shuttle(item).attr('data-name')))
    entries.addClass('hidden')
    visible.removeClass('hidden')
    console.log("entries, visible, cached", entries, visible, cached)
    return visible
  }

  addHandler (eventName, callback) {
    this.on(eventName, data => callback(data))
  }

  broadcastResults ({ data=[] }) {
    data = List(data.map(o => Map(o)))
    console.warn ("received data", data)
    console.warn ("received data in js", data.toJS ? data.toJS() : data)
    data = this.filter(data)
    console.warn ("items after filtering", data.toJS ? data.toJS() : data)
    console.warn ("received arguments", arguments)
    this.emit(MESSAGE.ON_RESULT, { data })
  }

}
