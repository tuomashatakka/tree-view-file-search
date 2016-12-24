'use babel'
import { Glob } from 'glob'
import { GitRepository } from 'atom'
import path from 'path'
import { List, Map } from 'immutable'


const GIT_DIR = '.git'
let options = null

let cache
export default function getCache({path, success}) {
  cache = cache || new FileCache({path, success})
  return cache
}

class FileCache {

    constructor({path, success}) {

      this.debounceRate = 300
      this.timestamp = new Date().getTime()
      this.successCallback = success || (() => {})
      this.items = new List([])
      this.path = path.shift()

      options = options || {
        ignore: ['node_modules', ...this.getIgnoredNames()],
        cache: this.emitter,
        cwd: this.path,
      }

      this.onError = this.onError.bind(this)
      this.onResult = this.onResult.bind(this)
      this.search = this.search.bind(this)
      this.query = this.query.bind(this)
      this.addItem = this.addItem.bind(this)
      this.removeItem = this.removeItem.bind(this)

      this.glob('**')
    }


    search (query=null) {

      if (this.items.size === 0 || !query)
        return this.items

      query = query ? new RegExp(query.trim(), 'g') : '.*'
      items = this.items.filter(
        o => {
          console.log(o.get('path'), o.get('path').search(query) !== -1)
          return o.get('path').search(query) !== -1
        }
      )
      this.successCallback(items)
      return items
    }

    glob(pattern) {

      let delta = this.debounceRate - (new Date().getTime() - this.timestamp)
      const fetch = (pattern) => {

        atom.devMode && console.log('Fetching', pattern, "dt", this.timestamp)
        clearTimeout(fetch)

        try {
          this.emitter = new Glob(
            pattern,
            options,
            (error, matches) => {

              console.log(this.emitter)
              console.log("Matches:\n\n", matches, "\n\n")
              this.timestamp = new Date().getTime()
              return error && !matches ?
                this.onError(error, matches, pattern) :
                this.onResult(List(matches), error)

            })
          // console.log(this.emitter)
        }
        catch(error) {
          this.onError(error)
          setTimeout((pattern) => fetch(pattern), 1500)
        }
      }


      if (delta > 0)
        fetch(pattern)
      else
        setTimeout(fetch, delta)

      this.timestamp = new Date().getTime()
      return this.emitter
    }


    query(q=() => true) {

      return this.items.filter(
        o => q(o)
        ? true
        : false)
    }


    onError (error, matches, pattern) {

      atom.devMode && console.warn("Error while fetching data:", error)

      setTimeout((pattern) => this.search(pattern), 1500)

    }


    onResult (items, error) {

      items.filter(o => this.isPathIgnored(o))
      console.log("items onResult", items)

      this.items = List(
        items.map(path => {
          let name = path.split('/').pop()
          let extension = name.split('.').pop()
          return Map({ name, path, extension })
          // this.addItem({name, path})
        })
      )

      console.log(this.items && this.items.toJS && this.items.toJS())
      this.successCallback(this.items)
    }

    getItems () {
      return this.items
    }


    getItemIndex ({name=null, path=null}) {

      if (!name && !path)
        return -1

      let index
      if (!name)
        return this.items.findIndex(
          o => o.get('path') == path )

      return this.items.findIndex(
        o => o.get('name') == name )
    }

    addItem ({name, path}) {

      let index = this.getItemIndex({path})
      let item = Map({ name, path })

      if (index >= 0)
        this.items.set(index, item)

      this.items.push(item)
      return item

    }

    removeItem ({path}) {

      let index = this.getItemIndex({path})
      return this.items.splice(index, 1)

    }

    getIgnoredNames () {
      const { ignoredNames } = atom.config.get('core')
      return ignoredNames
    }

    isPathIgnored (path) {
      this.repo = this.repo || new GitRepository(this.path + '/' + GIT_DIR)

      let vcsIgnored = this.repo.isPathIgnored(path)
      const { ignore } = options

      if (vcsIgnored)
        return true

      const test = new RegExp(

        ignore.map(
          name =>
            '(' +
            name.replace(/([^\w])/gi, needle => '\\' + needle) +
            ')+'
          )
          .join('|')
        )
      return path.search(test) !== -1
    }

}
