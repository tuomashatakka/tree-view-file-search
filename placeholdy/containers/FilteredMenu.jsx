/**
 * Created by julius on 30.9.2016.
 */

import {connect} from "react-redux";
import {addPlaceholder} from "../actions";
import Menu from "../components/Menu";

const getFilteredItems = (items, filter) => {
  if (filter.length > 0) {
    return items.filter(item => item.value.indexOf(filter) !== -1 || item.label.indexOf(filter) !== -1)
  }
  return items
}

const getFilteredItemsFromState = (state) => {
  let filter = state.get('filter')
  let items = getFilteredItems(state.get('items'), filter)
  if (filter.length > 0) {
    return items.filter(item => item.value.indexOf(filter) !== -1 || item.label.indexOf(filter) !== -1)
  }
  return items
}

const mapStateToProps = (state) => {
  let items = getFilteredItemsFromState(state),
      selected = state.get('selected') || 0,
      show

  if (items.size == 0) {
    show = false
  } else {
    show = state.get('show')
  }
  return { items, show, selected }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (text) => {
      dispatch(addPlaceholder(text))
    }
  }
}

const FilteredMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu)

export { getFilteredItemsFromState }

export default FilteredMenu
