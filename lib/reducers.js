'use babel'
import React from 'react'
import { Provider, connect } from "react-redux"
import { createStore, compose } from "redux";
import { render } from "react-dom"
import { fromJS, Map } from "immutable"
import { path } from "./utilities"
import cache from "./finder/SearchParser"


const actions = [
  'ADD_ITEM',
  'CLEAR_ITEMS',
  'cache',
  'search',
]

const ACTION = actions.reduce(
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
  switch (type) {

    case ACTION.ADD_ITEM:
      return state.update(
        'items', fromJS(
          state.get('items').push(payload)
        ))

    case ACTION.CLEAR_ITEMS:
      return state.set(
        'items', fromJS([]))

    case ACTION.cache:
      return state.set('files', cache.items)

    case ACTION.search:

      console.warn("\n", "payload", payload, "\n", "state", state)

      state = Object.assign({}, state, {searchQuery: payload})

      if (payload)
        state = Object.assign({}, state, { searchResult: cache.search(payload)})
      console.log(state)
      return state
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

  return methods
}


const provide = ({ View, root, props }) => {

  const initialState = props || {}

  const App = connect(
    extractState,
    extractDispatch)(
    View
  )

  const store = createStore(
    reducer,
    initialState
  )

  return render(
    <Provider store={store}><App/></Provider>,
    root
  )
}


export default provide
