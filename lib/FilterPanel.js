'use babel'
import React, { Component } from 'react'
import FileList from './components/FilteredItemsListView'
import FilterControls from './components/FilterControls'
import Cache from './finder/SearchParser'
import { getTreeView } from './utilities'


export default class FilterPanel extends Component {

    constructor (props) {

      super(props)

      this.show = this.show.bind(this)
      this.hide = this.hide.bind(this)
      let path = atom.project.getPaths()

      const success = e => {
        let { items } = this.state.cache
        this.setState({ items })
      }
      const cache = new Cache({path, success})

      this.state = {
        cache,
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
      let { visible, cache, items } = this.state
      let { openFile } = this.props
      let { search, query } = cache
      let listReference = null

      const toggle = () => visible ? this.hide() : this.show()
      let getitems = () =>
        <FileList
          items={items || []}
          ref={ref => listReference = ref || listReference}
          visible={visible}
          openFile={openFile}
        />

      return (
        <div className={'tree-view-filter-panel ' + (visible ? 'open' : 'closed')}>

          {getitems()}
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

        </div>
      )
    }
}
