'use babel'
import React from 'react'
import { Provider, connect } from "react-redux"
import { createStore, compose } from "redux";
import { render } from "react-dom"
import { fromJS } from "immutable"
import { path } from "./utilities"
import cache from "./finder/SearchParser"


let actions = [
  'ADD_ITEM',
  'CLEAR_ITEMS',
  'cache',
  'search',
]

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

let ACTION = actions.reduce(
      (a, o, n) =>
      Object.assign({}, a, {[o]: o}), {}
)

const Cache = cache({ path })
const reducer = (state, action) => {

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
      return state.set('files', Cache.items)

    case ACTION.search:
      state = state.set('search', payload)
      state = state.set('files', Cache.search(payload))
      console.log(state.toJS())
      return state
  }

  return state
}


const extractState = state => {
  console.log(state)
  return state
}


const extractDispatch = dispatch => {
  let callables = getActions()
  let methods = {
    dispatch: (type, payload) => dispatch((callables[type])(type, payload))
  }
  for (let type of actions) {
    console.log(type)
    let method = (callables[type])
    console.log(method)
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

  console.log("<App>", <App />)
  console.log("App", App)

  return render(
    <Provider store={store}><App/></Provider>,
    root
  )
}


export default provide
