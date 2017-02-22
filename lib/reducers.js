'use babel'
import React from 'react'
import { Provider, connect } from "react-redux"
import { createStore, compose } from "redux";
import { render } from "react-dom"
import { fromJS, Map, List } from "immutable"
import getCache, { MESSAGE } from "./finder/SearchResultsProvider"


let actions = [
  // 'ADD_ITEM',
  // 'CLEAR_ITEMS',
  'REQUEST_ITEM_LIST',
  'PROCESS_ITEM_RESULTS',
  'toggle',
  // 'cache',
  'search',
  'filter',
]

export let ACTION = actions.reduce((a, o) => a = { ...a, [o]: o}, {})

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

    let cache = getCache(path)

    let { type, payload } = action

    // let items, visible, existing, files,
    //     searchResult, searchQuery, activeFilters

    console.log("reducer call'd with type   ", type)
    console.log("reducer call'd with payload", payload)

    if (type === ACTION.toggle) {
    }
    else if (type === ACTION.search) {
      cache.search(payload)
      state = { ...state, query: payload }
    }
    else if (type === ACTION.REQUEST_ITEM_LIST) {
    }
    else if (type === ACTION.PROCESS_ITEM_RESULTS) {
      state = { ...state, items: payload.data }
    }
    return state
    // case ACTION.ADD_ITEM:
    //   items = fromJS(
    //       state.get('items').push(payload)
    //     )
    // case ACTION.CLEAR_ITEMS:
    //   items = fromJS([])
    //   return {
    //     ...state,
    //     items }

    // case ACTION.toggle:
    //   visible = !state.visible
    //   return {
    //     ...state,
    //     visible }
    //
    // case ACTION.cache:
    //   files = cache.get()
    //   return  {
    //     ...state,
    //     files }

  //   case ACTION.filter:
  //     activeFilters = state.activeFilters || {}
  //     if (!activeFilters[payload.name])
  //       activeFilters[payload.name] = (...o) => payload.test(...o)
  //     else
  //       delete activeFilters[payload.name]
  //     searchResult = cache.search(state.searchQuery || " ")
  //     console.log("searchResult before for loop", searchResult)
  //     // for (let filter in activeFilters) {
  //     //   searchResult = searchResult.query(activeFilters[filter])
  //     //   console.warn("searchResult", searchResult)
  //     // }
  //     return { ...state, searchResult, activeFilters }
  //
  //   case ACTION.search:
  //     searchQuery = payload
  //
  //     if (payload)
  //       searchResult = cache.search(payload)
  //     else
  //       searchResult = Promise.reject()
  //     return {
  //       ...state,
  //       searchQuery,
  //       searchResult }
  // }
  // return state
}


const extractState = state => {
  console.warn("\n------------------------------------", "extractState()", state, "\n------------------------------------")
  return state
}


const extractDispatch = dispatch => {

  const callables = getActions()
  const path = atom.project.getPaths()[0]

  let methods = {
    dispatch: (type, payload) => dispatch((callables[type])(type, payload))
  }

  for (let type of actions) {
    let method = (callables[type])
    methods[type] = (args) => dispatch(method(args))
  }

  let cache = getCache(path)
  cache.dispatch = (method) => dispatch(method)
  window.methods = methods
  window.cache = cache
  let process = (...arg) =>
    dispatch(methods[ACTION.PROCESS_ITEM_RESULTS](...arg))

  cache.on('result', data =>
    process(data))

  methods.getCache = () => cache
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
