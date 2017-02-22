'use babel'
import React, { Component } from 'react'
import { render } from 'react-dom'
import { getTreeView, openFile, message } from '../utils'
import FilterView from './FilterView'
import provide, { ACTION } from '../reducers'
import os from 'path'


export default class FilterPanel {

    constructor () {

      let item = document.createElement('atom-panel-fragment')
      this.panel = atom.workspace.addRightPanel({ item })
      this.visible = true

      item.setAttribute('type', 'tree-view-filter')
      item.setAttribute('class', 'inset-panel')
      render(<FilterView root={this} />, item)
      // this.render(item)
    }

    render (root) {
      let View = FilterView
      let props = { openFile, visible: this.visible }
      this.provider = provide({ View, props, root, })
      console.log("provider", this.provider)
      this.show()
    }

    isVisible () {
      return this.visible ? true : false
    }

    show () {
      this.visible = true
      console.log(this.panel.item)
      this.panel.item.setAttribute('class', 'open')
    }

    hide () {
      this.visible = false
      this.panel.item.setAttribute('class', 'hidden closed')
    }

    destroy () {
      this.hide()
      this.panel.destroy()
    }
}
