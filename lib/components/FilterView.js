'use babel'
import React, { Component } from 'react'
import FileList from './FilteredItemsListView'
import { List } from 'immutable'
import FilterControls from './FilterControls'
import { Button } from './core'
import { getTreeView, message, openFile } from '../utils'
import getCache, { MESSAGE } from "../finder/SearchResultsProvider"


export default class FilterView extends Component {

  constructor (props) {

    super(props)

    this.state = {
      items: List(),
      visible: true,
      query: "",
      filters: [],
    }

    this.cache = getCache()
    this.style = {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      minHeight: '6rem',
      background: '#282224',
      zIndex: 2000,
    }

    this.cache.on(MESSAGE.ON_RESULT, ({data}) =>
      this.setState({ items: data }))
  }

  toggled () {
    return this.state.visible ? ' open' : ' closed'
  }

  search (query) {
    this.cache.search(query)
  }

  render () {

    let { openFile } = this.props
    let { items, visible, query, filters, } = this.state

    console.warn("FilterView.props:", this.props)
    console.warn("FilterView.state:", this.state)

    return (
      <div className={`
           panel-body
           padded
           tree-view-filter-panel`}>

        <main className={this.toggled()}>

          <FileList
            items={items}
            openFile={openFile}
          />

          <FilterControls
            style={this.style}
            search={(query) => this.search(query)}
            query={query}
            filter={() => { this.cache.hideExcludedItems() }}
            toggle={() => this.setState({ visible: !visible })}
            filters={Object.keys(filters || {})}
          />
        </main>
      </div>
    )
  }
}
