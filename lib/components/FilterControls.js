'use babel'
import React from 'react'


let filterField = null

const FilterControls = ({search, query, toggle}) => (
  <aside class='form-group'>

    <section className='segment'>

      <atom-text-editor
        mini
        ref={ref => filterField = ref}
        className='control-group'
        defaultValue="/*"

        onKeyPress={e => {
          let field = filterField || e.target.closest('atom-text-editor')
          let value = field.textContent
          search(value)
        }}/>

    </section>

    <section className='segment btn-toolbar'>
      <button
        className='btn btn-default'
        onClick={e => filterField ? search(filterField.value) : false}>
        Search
      </button>

      <button
        className='btn btn-default'
        onClick={() => query(() => false)}>
        Clear
      </button>

      <button
        className='btn btn-default'
        onClick={(e) => toggle(e)}>
        <span className='icon icon-chevron-up' />
      </button>

    </section>
  </aside>
)


export default FilterControls
