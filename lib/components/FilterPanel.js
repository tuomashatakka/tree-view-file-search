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
      item.setAttribute('type', 'tree-view-filter')
      item.setAttribute('class', 'inset-panel')

      this.render = this.render.bind(this)
      this.visible = true
      this.panel = atom.workspace.addRightPanel({ item })
      this.render(item)
    }

    render (root) {
      // const visible = this.isVisible()
      // const toggle = () => visible ? this.hide() : this.show()

      console.log(ACTION.show, ACTION);
      let View = FilterView
      let props = {
        openFile,
        visible: true
      }

      this.provider = provide({
        View,
        root,
        props,
      })
      console.log("provider", this.provider)
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
