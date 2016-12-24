/**
 * Created by julius on 26.9.2016.
 */

import React from "react";
import $ from "jquery";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {createStore} from "redux";
import placeholdyApp, {PATTERN} from "./reducers";
import assignmentApp from "./reducers/assignment";
import {addPlaceholder, showMenu, hideMenu, filterItems, updateItems, clearFields, setFieldValue, checkValidity} from "./actions";
import App from "./components/App";
import {List, Map} from "immutable";
import provide from './containers'
import AssignmentForm from './containers/AssignmentForm'
import {resolveFields} from './utils'
import { selectionHandler } from 'utils'
import { getFilteredItemsFromState } from './containers/FilteredMenu'

const isInputtingPlaceholder = (value) => {
  return PATTERN.test(value)
}

const parseInput = (value) => {
  return PATTERN.exec(value)[0].replace('[[', '')
}

// Create wrapper for App
const createElement = (el) => {
  let element = el
  if(typeof element === 'string')
    element = document.querySelector(el)
  let wrapper = document.createElement('div')
  element.parentNode.insertBefore(wrapper, element)
  element.setAttribute('autocomplete', 'off')
  return [element, wrapper]
}


export const wysiwyg = (elem) => {
  let {el, toolbar, editor} = $(elem).data('wysihtml5')
  let btn = $('<div class="btn btn-default"></div>')
  let btnGrp = $('<div class="btn-group"></div>')

  const addButtonGroup = (items=[]) => {
    let insert = btnGrp.clone()
    for (let item of items) {
      addButton(
        item.icon,
        el => item.callback(el, item),
        { tooltip: item.label,
          targetGroup: insert }
      )
    }
    toolbar.append($('<li>').append(insert));
  }
  const addButton = (content, action, opts={}) => {
    let insert = opts.targetGroup || btnGrp.clone()

    if (typeof content !== 'string' && content.length > 1) {
      for(let b of content) {
        b = $(b)
        b.on('click', (e) => action($(el), b, e))
        b.appendTo(insert)
      }
    }
    else {
      let b = btn.clone()
      b.append(content)
      b.on('click', (e) => action($(el), b, e))

      b.qtip(opts.tooltip ? {
          content: opts.tooltip,
          position: { my: 'bottom center', at: 'top center'},
          style: { classes: 'qtip-tipsy' },
        } : content.toString())

      b.appendTo(insert)
    }
  }

  const addButtonsForFields = () => {
    let checkboxIco = $('<i class="fa fa-check-square">')
    let radioIco = $('<i class="fa fa-check-circle">')
    let inputIco = $('<i class="fa fa-pencil-square">')
    let items = [
      [
        { label: 'Checkbox selection', icon: checkboxIco, callback: (el) => el.wysihtm().insert('[[ OPTION | OPTION | ... ]]<br/>') },
        { label: 'Single selection', icon: radioIco, callback: (el) => el.wysihtm().insert('[[ OPTION / OPTION / ... ]]<br/>') },
        { label: 'Text input field', icon: inputIco, callback: (el) => el.wysihtm().insert('[[ optional placeholder ]]<br/>') },
      ],
    ]
    for(let group of items) {
      addButtonGroup(group)
    }
  }

  return { addButton, addButtonsForFields }
}

export let items

/**
 * Initializes a placeholdy functionality into the given element
 * @method init
 * @param  {string} el      Target element's id attr
 * @param  {object} opts    Optional arguments
 * @return {function}       Returns a function for updating the items in the list
 */
const init = function (el, opts) {
  opts = opts || {}
  items = opts.items
  let element = document.getElementById(el)
  element.setAttribute('autocomplete', 'off')
  opts.element = element

  // Create initial state
  const initialState = Map({
    'element': element,
    'filter': '',
    'show': false,
    'items': List(opts.items || []),
  });

  // Create wrapper for App
  let wrapper = document.createElement('div')
  element.parentNode.insertBefore(wrapper, element)
  let store = createStore(placeholdyApp, initialState)

  // Attach listeners to original element

  const onSelected = (event: Event) => {

    let {position} = event
    let items = getFilteredItemsFromState(store.getState())
    let text = items[position].value

    store.dispatch(addPlaceholder(text))
    store.dispatch(hideMenu())
  }

  // Interface for handling
  const menuInterface = selectionHandler({
    element,
    onSelected: (e) => onSelected(e)
  })

  const updateMenu = function (e) {
    let {target} = e
    if (isInputtingPlaceholder(target.value)) {
      store.dispatch(filterItems(parseInput(target.value)))

      let len = getFilteredItemsFromState(store.getState()).length
      menuInterface.setLimit(len)
      store.dispatch(showMenu(menuInterface.getPosition()))
    } else {
      store.dispatch(hideMenu())
    }
  }
  element.addEventListener('keyup', e => updateMenu(e))
  element.addEventListener('blur', e => updateMenu(e))
  window.ele = element


  // Hide menu if clicked else where
  window.addEventListener('mouseup', function (e) {
    if ($(e.target).closest('.placeholder-menu').length == 0) {
      store.dispatch(hideMenu())
    }
  })

  // Render App
  render(
    <Provider store={store}>
      <App opts={opts}/>
    </Provider>,
    wrapper
  )
  return (items) => store.dispatch(updateItems(items))
}


let provider


/**
 * Initializes a template field assignment modal for the given input. If there
 * is no content key in the opts object, the html of the opts.element is used
 * instead.
 *
 * @method assignmentMode
 * @param  {Object}         opts={} {?element, ?modalTitle, ?replace, ?content, ?forceValidation}
 * @return {Object}                 { <func>valid, <func>output, <func>clear, modal, body, <func>setTitle }
 */
export function assignmentMode(opts={}) {

  let wrapper
  let {element, modalTitle} = opts
  if(element) {
    if(opts.replace) {
      wrapper = typeof element === "string" ?
        document.querySelector(element) :
        element
      element = wrapper
    }
    else {
      [element, wrapper] = createElement(element)
    }
  }

  let content = opts.content || wrapper ? wrapper.innerHTML : ''

  const modal = $.makeModal(modalTitle || 'Assign', {actions: [

    { text: 'Close', icon: 'remove', style: 'cancel',
      action: () => modal.modal('hide') },

    { text: 'OK', icon: 'ok', style: 'save',
      action: function(event) {

        if(!opts.forceValidation || valid()) {
          let cbk = opts.successCallback || (f => f)
          cbk(output(false))
          modal.modal('hide') }

        else {
          let cbk = opts.errorCallback || (f => f)
          cbk(output(), body) }}}
  ]})

  modal.attr('style', 'z-index: 2000 !important')
  const body = modal.find('.modal-body').get(0)

  provider = provide(
    AssignmentForm,
    body || wrapper, // Always body
    assignmentApp, {
      fields: [],
      raw: content,
      ...resolveFields(content)
    }
  )

  const clear = (content='') => {
    try {
      provider.store.dispatch(clearFields({content}))
      return provider.store.getState().toJS()
    }
    catch(err) {
      // HACK: Clear the modal's body so React doesn't whine about the ownership of nodes
      body.innerHTML = ""

      // HACK: Rebuild the provider (dirty but works)
      provider = provide(AssignmentForm, body, assignmentApp, {
        fields: [], raw: content, ...resolveFields(content)})

      provider.store.dispatch(clearFields({content}))

      // FIXME: This should be unnecessary
      // let n = 0
      // while (n++ < provider.store.getState().get('fields').size) {
      //   provider.store.dispatch(setFieldValue(null))
      //   jQuery(body).find('input').each(function() {
      //     $(this).val("")
      //     $(this).prop('checked', false)
      //   })
      // }

      return provider.store.getState().toJS()
    }
  }

  const valid = () => {
    provider.store.dispatch(checkValidity())
    return provider.store.getState().get('valid')
  }

  const output = (onlyIfValid=true) => {
    let fields = provider.store.getState().get('fields')
    let content = provider.store.getState().get('raw')
    let out = (
      onlyIfValid === true && !valid() ? '':
      resolveFields(content, fields)
    )
    return out
  }

  const setTitle = (text) => modal.find('.modal-header h2').text(text + ' - ' + modalTitle)

  return { valid, output, clear, modal, body, setTitle }
}


export default module.exports = {
  init: init,
  assign: assignmentMode,
  wysiwyg: wysiwyg,
}


// Listen for module changes for hot reloading
reload.listen(module, (d) => {
  console.log("Reload", d)
})
