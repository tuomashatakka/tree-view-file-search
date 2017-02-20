'use babel'
import React from 'react'
import FileList from './FilteredItemsListView'
import { List } from 'immutable'
import FilterControls from './FilterControls'
import { Button } from './core'
import { getTreeView, message, openFile } from '../utils'


export default (props) => {

  let {searchResult, searchQuery, activeFilters, search, filter, openFile, toggle, visible } = props
  console.warn("FilterView.props:", props)
  let { items } = (searchResult || { items: []})
  console.info(items, searchResult)
  let toggled = () => visible ? ' open' : ' closed'
  let style = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: '6rem',
    background: '#282224',
    zIndex: 2000,
  }

  // <aside>
  //  <Button onClick={() => toggle()} icon='search' />
  // </aside>
  console.info(items)
  console.info(items && items.toJS ? items.toJS() : {})
  return (
    <div className={`
         panel-body
         padded
         tree-view-filter-panel`}>

      <main className={toggled()}>
        <FileList
          items={items}
          openFile={openFile}
        />

        <FilterControls
          style={style}
          search={search}
          searchQuery={searchQuery}
          filter={filter}
          activeFilters={Object.keys(activeFilters || {})}
          toggle={() => toggle()}
        />
      </main>
    </div>
  )
}
