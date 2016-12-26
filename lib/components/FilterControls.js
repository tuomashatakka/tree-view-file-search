'use babel'
import React from 'react'


let filterField = null
let subscription = null


const find = (field, search) => {
  // Emits a search action to the redux with the field's value
  // as a parameter

  let value
  if (field.tagName == 'INPUT')
    value = field.value
  else
    value = field.getModel().getText()
  return search(value)
}


const subscribe = (ref, search) => {
  // Subscribes to the onDidStopChanging event of the
  // ´ref´ text editor instance. ´search´ is the handler
  // for the change event.

  filterField = ref || filterField
  if (!subscription && filterField) {
    let textEditor = filterField.getModel()
    subscription = textEditor.onDidStopChanging(() => find(filterField, search))
  }
  return filterField
}


const FilterControls = ({search, filter, toggle}) => (

  <aside className='form-group'>
    <section className='segment control-group'>

      <atom-text-editor mini
        className='control-group input-block-item'
        ref={ref => subscribe(ref, search)}
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
