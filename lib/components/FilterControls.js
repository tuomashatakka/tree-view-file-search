'use babel'
import React from 'react'
import { Button, FilterButton } from './core'

let field = null
let subscription = null

// Emits a search action to the redux with the field's value
// as a parameter
const find = (field, search) => {

  let value
  if (field.tagName == 'INPUT')
    value = field.value

  else
    value = field.getModel().getText()

  return search(value)
}

// Subscribes to the onDidStopChanging event of the
// ´ref´ text editor instance. ´search´ is the handler
// for the change event.
const subscribe = (ref, search) => {

  field = ref || field
  if (!subscription && field) {
    let textEditor = field.getModel()
    subscription = textEditor.onDidStopChanging(() => find(field, search))
  }
  return field
}

const FilterControls = ({search=()=>null, filter=()=>null, toggle=()=>null, activeFilters}) => {
  const _search = () => field && search(field.value)
  const _filter = name => filter && filter({ name, test: o => o.get('extension').endsWith(name) || o.get('extension').startsWith(name)})
  const _sub = ref => ref = subscribe(ref, search)
  const active = flt => (activeFilters || []).indexOf(flt) > -1
  // <Button onClick={_search}>Search</Button>

  return (
    <aside className='form-group'>
      <section className='segment control-group'>

        <atom-text-editor mini className='control-group input-block-item' ref={_sub}/>
      </section>
      <section className='segment btn-toolbar btn-group'>

        <FilterButton icon='gist' val='js' fnc={_filter} active={active('js')}>js</FilterButton>
        <FilterButton icon='gist' val='html' fnc={_filter} active={active('html')}>htm</FilterButton>
        <FilterButton icon='gist' val='py' fnc={_filter} active={active('py')}>py</FilterButton>
        <FilterButton icon='gist' val='ss' fnc={_filter} active={active('ss')}>css</FilterButton>
        <Button icon='move-down' onClick={toggle}></Button>

      </section>
    </aside>
  )
}

export default FilterControls
