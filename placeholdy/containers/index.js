import React from 'react'
import {render} from "react-dom"
import {Provider} from "react-redux"
import devToolsEnhancer from 'remote-redux-devtools';
import { applyMiddleware, createStore, compose } from "redux";
import thunk from 'redux-thunk';
import {fromJS} from "immutable"


/**
 * Convenience method for creating the redux runtime
 * @method provide
 * @param  {React.Component} Component  App main view
 * @param  {HTMLNode}        wrapper    HTML element to wrap the app into
 * @param  {[type]}          reducer    Reducer for the application
 * @param  {Object}          store      Initial state as a plain javascript object
 * @return {React.Component}            Returns the ref to the rendered React component
 */
export default function provide(Component, wrapper, reducer, store) {
  store = createStage(reducer, store)
  return render(
    <Provider store={store}>
      <Component />
    </Provider>,
    wrapper
  )
}


const createStage = (reducer, state) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const enhancer = composeEnhancers(
    applyMiddleware(thunk),
    devToolsEnhancer())
  const store = createStore(reducer, fromJS(state), enhancer)

  return store
}
