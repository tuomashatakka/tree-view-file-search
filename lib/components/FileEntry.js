'use babel'
import React, { Component } from 'react'
import { getFileExtension } from '../utilities'


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
      let { name, path } = this.props
      let type = this.getType()

      return (
        <li
          className='file entry list-item'
          draggable='true'
          title={name}
          data-name={name}
          data-path={path}>

          <span className={'name icon icon-' + type}>
            {name}
          </span>

        </li>
      )
    }
}
