'use babel'
import React, { Component } from 'react'
import FileEntry from './FileEntry'
import { List } from 'immutable'


export default ({ items, visible, openFile }) => (
  <ol className='list-tree'>
    {List(items || []).map((o, n) =>
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
