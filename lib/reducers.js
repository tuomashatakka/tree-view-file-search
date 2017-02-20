'use babel'
import React from 'react'
import { Provider, connect } from "react-redux"
import { createStore, compose } from "redux";
import { render } from "react-dom"
import { fromJS, Map, List } from "immutable"
import cache from "./finder/SearchParser"


let actions = [
  'ADD_ITEM',
  'CLEAR_ITEMS',
  'cache',
  'search',
  'filter',
  'toggle',
]

export let ACTION = actions.reduce(
  (a, o, n) =>
  Object.assign({}, a, {[o]: o}), {})

const getActions = (n) => {
  let ret = {}
  for (let index in actions) {
    let type = actions[index]
    val = (payload) => ({
      type,
      payload,
    })
    if (n >= 0 && index === n)
      return val
    ret[type] = val
  }
  return ret
}


function reducer (state, action) {

  let { type, payload } = action
  let items, visible, existing, files,
      searchResult, searchQuery, activeFilters
  console.log("reducer call'd with type   ", type)
  console.log("reducer call'd with payload", payload)

  switch (type) {

    case ACTION.ADD_ITEM:
      items = fromJS(
          state.get('items').push(payload)
        )

    case ACTION.CLEAR_ITEMS:
      items = fromJS([])
      return {
        ...state,
        items }

    case ACTION.toggle:
      visible = !state.visible
      return {
        ...state,
        visible }

    case ACTION.cache:
      files = cache().items
      return  {
        ...state,
        files }

    case ACTION.filter:
      activeFilters = state.activeFilters || {}
      if (!activeFilters[payload.name])
        activeFilters[payload.name] = (...o) => payload.test(...o)
      else
        delete activeFilters[payload.name]
      searchResult = cache().search(state.searchQuery)
      console.log("searchResult before for loop", searchResult)
      for (let filter in activeFilters) {
        searchResult = searchResult.query(activeFilters[filter])
        console.warn("searchResult", searchResult)
      }
      return { ...state, searchResult, activeFilters }

    case ACTION.search:
      searchQuery = payload

      if (payload)
        searchResult = cache().search(payload)
      else
        searchResult = List([])
      return {
        ...state,
        searchQuery,
        searchResult }
  }
  return state
}


const extractState = state => {
  return state
}


const extractDispatch = dispatch => {

  let callables = getActions()

  let methods = {
    dispatch: (type, payload) => dispatch((callables[type])(type, payload))
  }

  for (let type of actions) {
    let method = (callables[type])
    methods[type] = (args) => dispatch(method(args))
  }

  console.log("methods", methods)
  return methods
}


const provide = ({ View, root, props, dispatchers }) => {

  const initialState = props || {}

  let App = connect(
    extractState,
    extractDispatch
  )(View)

  let store = createStore(
    reducer,
    initialState
  )
  let retur = render(
    <Provider store={store}><App/></Provider>,
    root
  )

  console.log("provider accrual", store, App, retur, Provider)
  return retur
}


export default provide
