'use babel'
import React from 'react'
import FileList from './FilteredItemsListView'
import { List } from 'immutable'
import FilterControls from './FilterControls'
import { getTreeView, message, openFile } from '../utilities'


export default ({searchResult, searchQuery, search, filter, openFile, toggleView, isVisible}) => {

  return (
    <div className={'tree-view-filter-panel ' + (isVisible() ? 'open' : 'closed')}>

      <FileList
        items={searchResult || List([])}
        openFile={openFile}
      />

      <FilterControls
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          minHeight: '6rem',
          background: '#282224',
          zIndex: 2000,
        }}
        search={search}
        searchQuery={searchQuery}
        filter={filter}
        toggle={toggleView}
      />

    </div>
  )
}
