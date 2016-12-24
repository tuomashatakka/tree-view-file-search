/**
 * Created by julius on 30.9.2016.
 */


export const filterItems = (filter) => {
  return {
    'type': 'FILTER_ITEMS',
    'payload': {
      'filter': filter
    }
  }
}

export const updateItems = (items) => {
  return {
    'type': 'UPDATE_ITEMS',
    'payload': {
      'items': items
    }
  }
}

export const addPlaceholder = (text) => {
  return {
    'type': 'ADD_PLACEHOLDER',
    'payload': {
      'text': text
    }
  }
}

export const showMenu = (selected) => {
  return {
    'type': 'SHOW_MENU',
    'payload': {show: true, selected: selected}
  }
}


export const hideMenu = () => {
  return {
    'type': 'HIDE_MENU',
    'payload': {show: false, selected: 0}
  }
}



//
// A S S I G N M E N T
// A C T I O N S
//
export const CHECK_VALIDITY = 'CHECK_VALIDITY'
export const SET_FIELD_VALUE = 'SET_FIELD_VALUE'
export const CLEAR_FIELDS = 'CLEAR_FIELDS'


/**
 * Checks if the given field is valid (=filled)
 * @method checkValidity
 * @param  {string}      field Name of the checked field
 */

export const setFieldValue = (prefix, n, value) => ({
  type: SET_FIELD_VALUE,
  method: prefix,
  payload: {n, value}})

export const checkValidity = (opts) => ({
  type: CHECK_VALIDITY,
  payload: {...opts}})

export const clearFields = (opts) => ({
  type: CLEAR_FIELDS,
  payload: {...opts}})
