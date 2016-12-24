/**
 * Created by julius on 30.9.2016.
 */


import {List, Map} from "immutable";

export const PATTERN = /(\[\[\w*)(?![^\[\[]*]])/m

const placeholdyApp = (state, action) => {
  switch (action.type) {
    case 'ADD_PLACEHOLDER':
      let element = state.get('element')
      element.value = element.value.replace(PATTERN, action.payload.text) + " "
      return state.set('show', false)
    case 'FILTER_ITEMS':
      return state.set('filter', action.payload.filter)
    case 'UPDATE_ITEMS':
      return state.set('items', action.payload.items)
    case 'SHOW_MENU':
      return state.set('show', true).set('selected', action.payload.selected)
    case 'HIDE_MENU':
      return state.set('show', false).set('selected', action.payload.selected)
    default:
      return state
  }
}

export default placeholdyApp
