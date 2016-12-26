'use babel'
import { path, getTreeView } from '../utils'


class TreeViewInterface {

  constructor () {
    this.tree     = getTreeView()
    this.view     = this.tree.treeView
    this.panel    = this.tree.treeView.panel
    this.item     = this.tree.treeView.panel.item
    this.element  = this.tree.treeView.element
  }

  entryForPath (...breadcrumbs) {
    let fullPath = os.resolve([path, ...breadcrumbs].join('/'))
    return this.view.entryForPath()
  }
}

const treeView = new TreeViewInterface()

export default (prop=null) => prop ? treeView[prop] : treeView
