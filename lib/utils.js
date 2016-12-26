'use babel'
import os from 'path'

export const paths = atom.project.getPaths()

export const path = paths[0]

export const pkg = atom.packages.getActivePackage('tree-view-filter')
// require(os.resolve(path + '/package.json'))

export const conf = atom.packages.config.get(pkg.name)

export const getFileExtension = (name) => {
    let parts = name.split('.')
    let extension = parts[parts.length - 1]
    switch (extension) {
      case 'js': return 'file-text'
      case 'md': return 'book'
    }
    return 'file-text'
}

export const toggleDiff = () => {
    let e = document.getElementsByClassName('git-line-modified')
    let editor = document.getElementsByClassName('.line')
    let c = null

    for(c = 0; c < e.length; c++) {
      let n = e[c].getAttribute('data-screen-row')
      let lines = document.querySelectorAll('.line[data-screen-row="'+n+'"]')
      lines.classList.add('git-line-modified')
    }
}

export const getTreeView = (...sub) => {
  let pack = atom.packages.getActivePackage('tree-view')
  let tree = pack.mainModule
  return sub.reduce((a, key) => a[key], tree)
}

export const openFile = (path) => {
  return openAbsoluteFile(os.resolve(path))
}

export const openAbsoluteFile = (path=null) => {
  console.log(path)
  let pane, { items, id } = atom.workspace.getActivePane()
  let openAsNew = () => atom.workspace.open(path)
  let activate = (item) =>
    item && item.getPath && item.getPath() == path ?
    pane.activateItemAtIndex(id) && true : false

  for(let index in items) {
    let item = items[index]
    if(activate(item))
      return index
  }
  openAsNew()
  return -1
}

export const message = ({
  message='', style='info', detail=null, icon='circle-slash'}) => {

  atom.notifications.add(
    style,
    message,
    { detail, icon }
  )
}

window.getTreeView = (...a) => getTreeView(...a)
