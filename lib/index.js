'use babel';
import React from 'react'
import { render } from 'react-dom'
import FilterPanel from './FilterPanel'
import { getTreeView } from './utilities'
import { CompositeDisposable, Emitter, packages } from 'atom'


const log = (...args) => {
  //let caller = log.caller ? log.caller.name : log.caller;
  let caller = ""
  let name = "" // obj.constructor.name
  return [...args].map(obj => { console.log("\n[", caller, "/", name, "]", obj); })
}


const PKG_NAME = 'tree-view-filter'
console.log(PKG_NAME)

export default TreeViewFilterPackage = {

    panel: null,
    subscriptions: null,
    treeView: null,

    activate(state) {
      let self = this
      this.treeView = getTreeView()
      const projectRootElement = document.querySelector('.tree-view-resizer')
      const rootNode = document.createElement('atom-panel')
      rootNode.setAttribute('class', 'tree-view-filter-list list-tree entries')

      projectRootElement.appendChild(rootNode)

      // let initialState = this.conf.clearOnInit !== true && state ?
      //     ([...state]).map(item => self.add(item)) :
      //     []

      let cmds = atom.commands.add(
        'atom-workspace', {

          'tree-view-filter:toggle': () => self.toggle(),
          'tree-view-filter:open': (path) => self.open(path),
          'tree-view-filter:remove': (query) => self.remove(query),
          'tree-view-filter:clear': () => self.clear()

        })

      this.conf = atom.packages.config.get(PKG_NAME)
      this.subscriptions = new CompositeDisposable()
      this.panel = render((<FilterPanel openFile={this.open} />), rootNode)
      this.subscriptions.add(cmds)
      this.listen()
    },


    deactivate() {
      // this.panel.destroy()
      this.subscriptions.dispose()
      // rootNode.remove()
      this.panel = null
    },


    notify({message, style='info', details=null, icon=null}) {
      atom.notifications.add(style, message || '', {
        detail: details || null,
        dismissable: true,
        icon: icon || 'circle-slash'
      })
    },


    open(path=null) {
      let pane = atom.workspace.getActivePane()

      for(let index of pane.items) {
        let item = pane.items[index]

        if (item && item.getPath && item.getPath() == path) {
          pane.activateItemAtIndex(index)

          return index
        }
      }

      atom.workspace.open(path)
      return -1
    },


    remove(item=null) {
      return item ? this.panel.removeItem(item) : this.clear()
    },


    clear() {
      this.panel.items = []
    },


    listen() {
      return
    },


    serialize() {
      // return this.panel.serialize()
    },


    toggle() {
      let result = (
        this.panel.isVisible() ?
        this.panel.hide() :
        this.panel.show() )

      this.notify({ message: 'Toggled tree view filter' })
      return result
    }


};
