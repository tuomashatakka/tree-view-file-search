'use babel'
import { Glob } from 'glob'


export default class FileCache {

    constructor({path, success}) {
      this.onError = this.onError.bind(this)
      this.onResult = this.onResult.bind(this)
      this.search = this.search.bind(this)
      this.query = this.query.bind(this)
      this.addItem = this.addItem.bind(this)
      this.removeItem = this.removeItem.bind(this)

      this.debounceRate = 300
      this.timestamp = new Date().getTime()
      this.path = path
      this.successCallback = success
      this.items = []

      this.search('lib/*')
    }

    search (q='**') {

      let pattern = this.path[0] + '/' + q.trim()
      let delta = new Date().getTime() - this.timestamp

      const fetch = () => {
        clearTimeout(fetch)
        this.emitter = new Glob(
            pattern, {},
            (err, matches) =>
            err && !matches
            ? this.onError(err, matches)
            : this.onResult(matches, err)
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
      console.log("ITEMS", items);
      console.log("ERROR", error);

      this.items = []
      for (let path of items) {
        let dirs = path.split('/')
        let name = dirs[dirs.length - 1]
        this.addItem({name, path})
      }
      this.successCallback(this.items)
    }

    getItemIndex ({name=null, path=null}) {

      if (!name && !path)
        return {}

      let index
      if (!name)
        return this.items.findIndex(
          o => o.path == path )

      return this.items.findIndex(
        o => o.name == name )
    }

    addItem ({name, path}) {

      let index = this.getItemIndex({path})
      let item = { name, path }

      if (index >= 0)
        this.items[index] = item

      this.items.push(item)
      return item

    }

    removeItem ({path}) {

      let index = this.getItemIndex({path})
      return this.items.splice(index, 1)

    }

}
