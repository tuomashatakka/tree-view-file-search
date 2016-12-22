'use babel'
import React, { Component } from 'react'
import { getFileExtension } from '../utilities'
import os from 'path'


export default class FileEntry extends Component {

    constructor(props) {
      super(props)
      this.getType = this.getType.bind(this)
    }

    getType () {
      let { name } = this.props
      return getFileExtension(name)
    }

    render () {
      let { name, path, openFile } = this.props
      let type = this.getType()

      path = os.join(atom.project.getPaths()[0], path)

      // TODO: entry class
      /*{ ref={ref => {
        if (ref)
        ref.getPath = () => path
      }} }*/
      return (
        <li
          className='file list-item'
          draggable='true'
          title={name}
          onClick={() => openFile(path)}>

          <span
            className={'name icon icon-' + type}
            data-name={name}
            data-path={path}
            >
            {name}
          </span>

        </li>
      )
    }
}
