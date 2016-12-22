'use babel'
import React, { Component } from 'react'
import FileList from './components/FilteredItemsListView'
import FilterControls from './components/FilterControls'
import Cache from './finder/SearchParser'
import { getTreeView } from './utilities'


export default class FilterPanel extends Component {

    constructor (props) {

      super(props)

      let path = atom.project.getPaths()
      let items = []

      const success = e => {
        let { items } = this.cache
        console.log(e)
        console.log(this.cache.items)
        this.setState({ items })
      }
      this.cache = new Cache({path, success})

      this.state = {
        items,
        visible: true,
      }
    }

    // Tear down any state and detach
    destroy () {
    }

    isVisible () {
      return this.state.visible
    }

    hide () {
      this.setState({ visible: false })
    }

    show () {
      this.setState({ visible: true })
    }

    render () {
      let { items, visible } = this.state
      let { search, query } = this.cache
      let listReference = null

      const list = (
        <FileList
          items={items || []}
          ref={ref => listReference = ref || listReference}
          visible={visible}
        />
      )

      const toggle = () => visible ? this.hide() : this.show()

      const input = (
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
          query={query}
          toggle={toggle}
        />
      )


      return (
        <div className={'tree-view-filter-panel ' + (visible ? 'open' : 'closed')}>

          {list}
          {input}

        </div>
      )
    }
}
