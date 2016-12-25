'use babel'
import React, { Component } from 'react'
import FileEntry from './FileEntry'


export default (props) => {
    let { items, visible, openFile } = props
    console.log("items", items);

    return (
      <ol
        className='list-tree'
        style={{
          display: visible ? 'block' : 'none'
        }}>
        {items.map((o, n) =>
          <FileEntry
            key={n}
            openFile={openFile}
            name={o.get('name')}
            path={o.get('path')}
            extension={o.get('extension')}
          />
        )}
      </ol>
    )
}
