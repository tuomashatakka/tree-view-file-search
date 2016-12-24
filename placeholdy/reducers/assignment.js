/**
 * Created by tuomas on 3.10.2016.
 */
import * as actions from '../actions'
import {List, fromJS} from 'immutable'
import {resolveFields} from '../utils'


export const PATTERN = /(\[\[){1}([^\]]*)(\]\]){1}/g
export const DELIM_CHECKBOXES = '|'
export const DELIM_RADIO = '/'
export const DELIM_DEFAULT = DELIM_CHECKBOXES

export const TYPE_CHECKBOX = 'checkbox'
export const TYPE_RADIO = 'radio'
export const TYPE_TEXTFIELD = 'text'

const placeholdyAssignmentApp = (state, action) => {

  let {n, value} = action.payload ? action.payload: action
  let {type, method} = action

  switch (type) {

    case actions.CLEAR_FIELDS:
      return clearFields(state, action.payload)

    case actions.SET_FIELD_VALUE:
      var fields = state.getIn(['fields', n]) || new List([])
      return setFieldValue(state, fields, method, n, value)

    case actions.CHECK_VALIDITY:
      return checkValidity(state)

    case actions.SET_RASTER:
      return state.set('raster', action.payload)

  }
  return state
}


function clearFields(state, opts) {
  let initialState = {
    fields: [],
    raw: opts.content,
    ...resolveFields(opts.content)
  }
  return fromJS(initialState)
}


function setFieldValue(state, fields, method, n=null, value='') {
  switch(method) {

    case null:
      if (n === null)
        return state.set('fields', List(Array(state.get('fields').size)))
      return state.setIn(['fields', n], null)

    case TYPE_CHECKBOX:
      var pos = fields.findEntry((obj) => obj == value) || -1
      if (pos === -1)
        return state.updateIn(['fields', n], L => (L || new List()).push(value))
      return state.deleteIn(['fields', n, pos[0]])

    case TYPE_TEXTFIELD:
    case TYPE_RADIO:
      return state.setIn(['fields', n], value)

  }
  return state
}


function checkValidity(state) {
  let totalCount = state.get('tokens').size
  let filled = state.get('fields')
  let valid = totalCount === filled.size
  filled.forEach(field => valid = valid && (field ? valid : false))
  return state.set('valid', valid)
}

export default placeholdyAssignmentApp
