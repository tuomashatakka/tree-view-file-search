'use babel';
import React from 'react'
import { render } from 'react-dom'
import { CompositeDisposable } from 'atom'

import { getTreeView, message, openFile, pkgName } from './utils'
import treeView from './finder/TreeViewInterface'
import SearchResultsProvider from './finder/SearchResultsProvider'
import FilterPanel from './components/FilterPanel'


let treeFilter = null
let subscriptions = null


function createPanelFragment () {
  if (treeFilter)
    return treeFilter
  let element = document.querySelector('.tree-view-filter-panel')
  let view = element ? element.view : new FilterPanel()
  let treeview
  try {
    treeview = atom.views.getView(treeView('panel'))
  } catch (e) {
    treeview = document.createElement('atom-panel')
    document.querySelector('atom-panels.right').appendChild(treeview)
  }
  view.panel.item.setAttribute('class', 'tree-view-filter-list list-tree entries')
  treeview.appendChild(view.panel.item)
  return view
}

function setCommands (obj, ...cmd) {
  let commands = cmd.reduce(
    (acc, name) =>
    Object.assign(acc, {[pkgName() + ':' + name]: (...args) =>
      obj[name] && obj[name](...args)}), {})
  console.log(commands)
  commands = atom.commands.add('atom-workspace', commands)
  console.log(commands)
  return commands
}
atom.commands.add('atom-workspace', 'qqq:test', () => {
  const { Task } = require('atom')
  const { resolve } = require('path')

  let src = '/Users/tuomas/Projects/Atom/atom-tree-view-filter/lib/proc/cache-index.js'
  let path = atom.project.getPaths()[0]
  let query = 'i'
  let filterOne = item => item.get('name').endsWith('.json')
  let result = Task.once(
    resolve(src),
    path,
    query,
    { type: 'extension', query: 'js' },
    data => console.log("CALLBACK CALLED", data, result))
  result.on('search', data => { console.info("task.search", data, result) })
  result.on('filter', data => { console.info("task.filter", data) })
  console.warn("task:", result)
})

export default TreeViewFilterPackage = {

    activate(state) {
      atom.devMode && message({ message: 'Activating package ' + pkgName() })

      treeFilter = createPanelFragment()
      let commands = setCommands(this, 'toggle', 'open', 'remove', 'clear')
      subscriptions = new CompositeDisposable()
      this.provider = new SearchResultsProvider()

      subscriptions.add(commands)
      this.toggle(true)
    },

    deactivate() {
      atom.devMode && message({ message: 'Deactivating package ' + pkgName() })
      this.toggle()
    },

    close () {
      if (subscriptions)
        subscriptions.dispose()
      this.remove()
    },

    remove: () => treeFilter && treeFilter.destroy(),
    serialize: () => ({ deserializer: null }),
    toggle: (force) =>
      treeFilter.isVisible() && !force ?
      treeFilter.hide() : treeFilter.show()
}
