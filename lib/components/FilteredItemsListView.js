'use babel'
import React, { Component } from 'react'
import FileEntry from './FileEntry'


export default class FilteredItemsListView extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    let { items, visible } = this.props


    return (
      <ol
        className='list-tree'
        style={{
          display: visible ? 'block' : 'none'
        }}>
        {items.map((o, n) =>
          <FileEntry key={n} {...o} />
        )}
      </ol>
    )
  }
}