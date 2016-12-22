'use babel'
import { Glob } from 'glob'
import { GitRepository } from 'atom'
import path from 'path'
import { List, Map } from 'immutable'


const GIT_DIR = '.git'


export default class FileCache {

    constructor({path, success}) {

      const { ignoredNames } = atom.config.get('core')

      this.debounceRate = 300
      this.timestamp = new Date().getTime()
      this.successCallback = success
      this.items = []
      this._cache = new List([])
      this.path = path

      this.options = {
        ignore: ['node_modules', ...ignoredNames],
        cache: this.emitter,
      }

      this.onError = this.onError.bind(this)
      this.onResult = this.onResult.bind(this)
      this.search = this.search.bind(this)
      this.query = this.query.bind(this)
      this.addItem = this.addItem.bind(this)
      this.removeItem = this.removeItem.bind(this)

      this.search()
    }


    search (q='**') {

      let pattern = q.trim()
      //  path.join(this.path[0],
      //  )
      console.log(this._cache)
      if (this._cache.size) {

        let query
        if (q != '**')
          query = new RegExp(pattern, 'g')

        this.items = this._cache.filter(
          o => o.get('path').search(query) !== -1)

        this.successCallback(this.items)
        return this.items
      }
      let delta = new Date().getTime() - this.timestamp

      const fetch = () => {
        console.log('fetching', pattern, "@", this.timestamp)
        clearTimeout(fetch)

        this.emitter = new Glob(
          pattern,
          this.options,
          (err, matches) =>
            err && !matches ?
              this.onError(err, matches) :
              this.onResult(matches, err)
        )
        console.log(this.emitter)
      }


      if (delta > this.debounceRate)
        fetch()
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


    onError (error, matches) {

      console.log("ERROR", error);
      console.log("ERROR matches", matches);

    }


    onResult (items, error) {

      this._cache = List([])
      for (let path of items) {

        if (this.isPathIgnored(path))
          continue

        let dirs = path.split('/')
        let name = dirs[dirs.length - 1]
        this._cache = List([...this._cache, Map({ name, path })])
        console.log(name, path)
        // this.addItem({name, path})
      }
      console.log(this._cache)
      this.successCallback(this.items)
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
      this.repo = this.repo || new GitRepository(GIT_DIR)

      let vcsIgnored = this.repo.isPathIgnored(path)

      if (vcsIgnored)
        return true

      const { ignore } = this.options

      const test = new RegExp(
        ignore.map(
          name => '(' +
          name.replace(
            /([^\w])/gi,
            needle => '\\' + needle) +
          ')+' )
        .join('|'))
      let matchesIgnoredNames = path.search(test) !== -1

      return matchesIgnoredNames
    }

}
