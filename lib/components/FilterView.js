'use babel'
import React from 'react'
import FileList from './FilteredItemsListView'
import FilterControls from './FilterControls'
import { getTreeView, message, openFile } from '../utilities'


export default (props) => {

  let {items, search, filter, openFile, toggleView, isVisible} = props

  console.log("FilterView.props", props)
  atom.devMode && message({ message: 'Rendering FilterView with items' + JSON.stringify(items) })

  console.log("Rendering FilterView", search, "with items", items)
  let visible = isVisible && isVisible() || true

  return (
    <div className={'tree-view-filter-panel ' + (visible ? 'open' : 'closed')}>

      <FileList
        items={items}
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
        filter={filter}
        toggle={toggleView}
      />

    </div>
  )
}
