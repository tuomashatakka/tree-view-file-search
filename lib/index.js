'use babel';
import React from 'react'
import { render } from 'react-dom'
import { CompositeDisposable, Emitter, packages } from 'atom'

import { getTreeView, message, openFile } from './utilities'
import FilterPanel from './components/FilterPanel'


const PKG_NAME = 'tree-view-filter'
const conf = atom.packages.config.get(PKG_NAME)

let treeView = null
let treeFilter = null
let subscriptions = null
let commands = null


export default TreeViewFilterPackage = {

    activate(state) {

      atom.devMode && message({ message: 'Activating tree view filter' })
      console.log(openFile)
      treeView = getTreeView()
      treeFilter = new FilterPanel({ openFile })
      treeFilter.panel.item.setAttribute('class', 'tree-view-filter-list list-tree entries')
      console.log(treeFilter)

      commands = atom.commands.add(
        'atom-workspace', {
          'tree-view-filter:toggle': () => this.toggle(),
          'tree-view-filter:open': (path) => this.open(path),
          'tree-view-filter:remove': (query) => this.remove(query),
          'tree-view-filter:clear': () => this.clear()
        })

      subscriptions = new CompositeDisposable()

      console.log("treeFilter", treeFilter)
      subscriptions.add(commands)
    },

    deactivate() {
      // treeFilter.destroy()
      atom.devMode && message({ message: 'Deactivating tree view filter' })
      subscriptions.dispose()
      this.remove()
    },

    remove(item=null) {
      treeFilter.destroy()
    },

    serialize() {
      return { deserializer: null }
      // return treeFilter.serialize()
    },

    toggle() {
      let result = (
        treeFilter.isVisible() ?
        treeFilter.hide() :
        treeFilter.show() )

      message({ message: 'Toggled tree view filter' })
      return result
    }
}
