'use babel'
import React from 'react'
import FileList from './FilteredItemsListView'
import { List } from 'immutable'
import FilterControls from './FilterControls'
import { getTreeView, message, openFile } from '../utilities'


export default (props) => {

  let {searchResult, searchQuery, search, filter, openFile, toggleView, isVisible} = props

  console.log("FilterView.props", props)
  atom.devMode && message({ message: 'Rendering FilterView with items' + JSON.stringify(searchResult) })

  console.log("Rendering FilterView", search, "with items", searchResult)
  let visible = isVisible && isVisible() || true

  return (
    <div className={'tree-view-filter-panel ' + (visible ? 'open' : 'closed')}>

      <FileList
        items={searchResult || List([])}
        visible={visible}
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
