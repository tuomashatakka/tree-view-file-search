'use babel'
import React, { Component } from 'react'
import { render } from 'react-dom'
import { getTreeView, message } from '../utilities'
import Cache from '../finder/SearchParser'
import FilterView from './FilterView'
import provide from '../reducers'
import os from 'path'

const path = atom.project.getPaths()

export default class FilterPanel {

    constructor (options) {

      this.visible = false
      this.openFile = options.openFile
      let item = document.createElement('atom-panel-fragment')
      item.setAttribute('type', 'tree-view-filter')
      this.panel = atom.workspace.addRightPanel({
        item })

      this.render = this.render.bind(this)

      const success = (newItems => {
        console.log("SUCCESS CALLBACK", newItems)
      })

      console.log(
        FilterView,
        <FilterView />
      )

      this.render(item)
    }

    render (root) {

      let { isVisible } = this
      let View = FilterView
      const openFile = (relPath) =>
        this.openFile(os.resolve(path.pop() + '/' + relPath))

      const toggleView = () =>
        this.isVisible() ?
        this.hide() :
        this.show()

      let props = {
        openFile,
        toggleView,
        isVisible,
      }
      console.log("HOC.PROPS", props)
      const component = provide(
        {
          View,
          root,
          props,
        }
      )
      console.log("component", FilterView, provide)
      console.log("component", component)

      this.show()
      return component
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
      this.panel.destroy()
    }
}
