'use babel';
import React from 'react'
import { render } from 'react-dom'
import { CompositeDisposable } from 'atom'

import { getTreeView, message, openFile, pkgName } from './utils'
import treeView from './finder/TreeViewInterface'
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

export default TreeViewFilterPackage = {

    activate(state) {
      atom.devMode && message({ message: 'Activating package ' + pkgName() })
      subscriptions = new CompositeDisposable()
      treeFilter = createPanelFragment()
      let commands = setCommands(this, 'toggle', 'open', 'remove', 'clear')
      subscriptions.add(commands)
      this.toggle(true)
    },

    deactivate() {
      atom.devMode && message({ message: 'Deactivating package ' + pkgName() })

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
