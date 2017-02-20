'use babel'
import { Glob } from 'glob'
import { GitRepository } from 'atom'
import { List, Map } from 'immutable'
import path from 'path'
import { path as projectPath } from "../utils"
const QUERY_MIN_LENGTH = 1

const GIT_DIR = '.git'
let options = null

class FileCache {

    constructor() {
      let success = null
      let error = null

      this.debounceRate = 3000
      this.timestamp = new Date().getTime()
      this.successCallback = success || (() => {})
      this.errorCallback = error || (() => {})
      this.items = new List([])
      this.path = projectPath

      options = options || {
        ignore: ['node_modules/**', ...this.getIgnoredNames()],
        cache: this.emitter,
        cwd: this.path,
      }

      this.onError = this.onError.bind(this)
      this.onResult = this.onResult.bind(this)
      this.search = this.search.bind(this)
      this.query = this.query.bind(this)

      // Cache all project's files
      this.glob('**')
    }


    search (query=null) {

      if (this.items.size === 0 || !query || query.length < QUERY_MIN_LENGTH)
        return List()

      const fetch = () => {

        clearTimeout(fetch)

        // Debounce
        let timestamp = new Date().getTime()
        let delta = this.debounceRate - (timestamp - this.timestamp)
        this.timestamp = timestamp
        if (delta > 0) {
        //  setTimeout(fetch, delta)
        //  return this.items
        }

        query = query ? new RegExp(query.trim().replace(/\s/g, '|'), 'g') : '.*'
        let items = this.items.filter(o => o.get('path').search(query) !== -1 && this.isAllowed(o.get('path')))
        return items
      }

      let items = fetch()
      this.successCallback(items)

      return this.process(items)
    }

    glob(pattern) {

      atom.devMode && console.log(
        'Fetching', pattern, "dt", this.timestamp)

      try {
        this.timestamp = new Date().getTime()
        this.emitter = new Glob(
          pattern,
          options,
          (error, matches) => {
            return error && !matches ?
              this.onError(error, matches, pattern) :
              this.onResult(List(matches), error)

          })
      }
      catch(error) {
        this.onError(error)
      }

      return this.emitter
    }


    process(result) {
      let items = List([...result])
      return {
        items,
        search: (...arg) => this.search(...arg),
        query:  (arg) => this.query(arg, items),
      }
    }

    query(q=() => false, items) {
      return this.process(List(items || this.items).filter( o => q(o) ? true : false ))
    }

    onError (error, matches, pattern) {
      atom.devMode && console.warn("Error while fetching data:", error)
      setTimeout((pattern) => this.search(pattern), 1500)
    }

    onResult (items, error) {
      items = List(
        items.map(path => {
          let name = path.split('/').pop()
          let extension = name.split('.').pop()
          return Map({ name, path, extension })
          // this.addItem({name, path})
        })
      )
      this.items = items.filter(o => this.isAllowed(o.get('path')))
      console.log(this.items && this.items.toJS && this.items.toJS())
      this.successCallback(this.items)
    }

    getItems () {
      return this.items
    }

    getIgnoredNames () {
      const { ignoredNames } = atom.config.get('core')
      return ignoredNames
    }

    ignoreCondition () {

      if (this._ignoreCondition)
        return this._ignoreCondition

      const { ignore } = options
      return this._ignoreCondition = new RegExp(

        ignore.map(
          name =>
          [ '(',
            name.replace(/([\*]+)/g, needle => '([\w]+)'), // .replace(/\s+/g, '|'),
        //     .replace(
        //       /([^\w])/gi,
        //       needle =>
        //       '\\' + needle
        //     ),
          ')+' ].join('')
        ).join('|')
      )
    }

    isAllowed (path) {
      let repo, vcsIgnored, globIgnored
      let cond = this.ignoreCondition()

      try {
        repo = this._repository = this._repository || new GitRepository(this.path + '/' + GIT_DIR)
        vcsIgnored = repo && repo.isPathIgnored ?
          ((path) => repo.isPathIgnored(path)) :
          (() => false)
        globIgnored = () => path.search(cond) !== -1
      }
      catch(e) {
        atom.devMode && console.error("Error while trying to resolve ignored paths:", e)
      }

      let res = !vcsIgnored() && !globIgnored()
      if (!res)
        console.error(path, res)
      else
        console.info(path, res)
      return res
    }
    //
    // getItemIndex ({name=null, path=null}) {
    //   if (!name && !path)
    //     return -1
    //   let index
    //   if (!name)
    //     return this.items.findIndex(o => o.get('path') == path )
    //   return this.items.findIndex(o => o.get('name') == name )
    // }
    //
    // addItem ({name, path}) {
    //   let index = this.getItemIndex({path})
    //   let item = Map({ name, path })
    //   if (index >= 0)
    //     this.items.set(index, item)
    //   this.items.push(item)
    //   return item
    // }
    //
    // removeItem ({path}) {
    //   let index = this.getItemIndex({path})
    //   return this.items.splice(index, 1)
    // }
    //
}


let _cache = new FileCache()


export default function getCache() {
  return _cache
}
