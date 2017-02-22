'use babel'
import React, { Component } from 'react'
import FileEntry from './FileEntry'
import { List } from 'immutable'


export default ({ items=List(), visible, openFile }) => (
  <ol className='list-tree'>
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
