'use babel'
import React, { Component } from 'react'
import { render } from 'react-dom'
import { getTreeView, openFile, message } from '../utils'
import FilterView from './FilterView'
import provide from '../reducers'
import os from 'path'


export default class FilterPanel {

    constructor () {
      let item = document.createElement('atom-panel-fragment')
      item.setAttribute('type', 'tree-view-filter')

      this.render = this.render.bind(this)
      this.visible = true
      this.panel = atom.workspace.addRightPanel({ item })
      this.render(item)
    }

    render (root) {
      const isVisible = () => this.isVisible()
      const toggleView = () => isVisible() ? this.hide() : this.show()
      let View = FilterView
      let props = {
        openFile,
        toggleView,
        isVisible }

      provide({ View, root, props })
      this.show()
    }

    isVisible () {
      return this.visible ? true : false
    }
    show () {
      this.panel.item.setAttribute('class', 'open')
      this.visible = true
    }
    hide () {
      this.panel.item.setAttribute('class', 'hidden closed')
      this.visible = false
    }
    destroy () {
      this.hide()
      this.panel.destroy()
    }
}
