'use babel'
import React from 'react'


let filterField = null

const triggerSearch = (e, search) => {
    let field = filterField || e.target.closest('atom-text-editor')
    let value = field.getModel().buffer.getText()
    console.log(field, value)
    search(value)
  }
const FilterControls = ({search, filter, toggle}) => (

  <aside className='form-group'>
    <section className='segment'>

      <atom-text-editor
        mini
        ref={ref => filterField = ref || filterField}
        className='control-group'
        onBlur={e => triggerSearch(e, search)}
      />

    </section>

    <section className='segment btn-toolbar'>
      <button
        className='btn btn-default'
        onClick={e => filterField ? search(filterField.value) : false}>
        Search
      </button>

      <button
        className='btn btn-default'
        onClick={(e) => {
          console.log(e)
          toggle(e)
        }}>
        <span className='icon icon-chevron-up' /> Toggle
      </button>

      <button
        className='btn btn-default'
        onClick={(e) => {
          console.log(e)
          filter(o => o.get('name').endsWith('.js'))
        }}>
        <span className='icon icon-gist' /> JS
      </button>

      <button
        className='btn btn-default'
        onClick={(e) => {
          console.log(e)
          filter(o => o.get('name').endsWith('.html'))
        }}>
        <span className='icon icon-gist' /> Html
      </button>

    </section>
  </aside>
)


export default FilterControls
