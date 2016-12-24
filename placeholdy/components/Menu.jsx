/**
 * Created by julius on 26.9.2016.
 */
import React, {Component, PropTypes as prop} from "react";
import MenuItem from "./MenuItem";
import Tether from "tether";
import {List} from "immutable";

class Menu extends Component {
  menu = null

  constructor(props) {
    super(props)
    this.target = props.opts.element
  }

  componentDidMount() {
    let self = this
    if (this.menu && this.target) {
      setTimeout(function () {
        new Tether({
          element: self.menu,
          target: self.target,
          attachment: 'top left',
          targetAttachment: 'bottom left'
        })
      }, 500)
    }
  }

  render() {
    let style = {
      'display': this.props.show ? 'block' : 'none'
    }
    let {onClick, items, selected} = this.props
    return (
      <ul className="dropdown-menu placeholder-menu" style={style}
          ref={(e) => this.menu = e}>

        {items.map((item, n) => {
          let {label, value} = item
          let active = (selected || 0) === n

          return (
            <MenuItem
              label={label}
              value={value}
              selected={active}
              key={n}
              onClick={() => onClick(value)}
            />

        )})}
      </ul>
    )
  }
}

Menu.propTypes = {
  opts: prop.object,
  show: prop.bool,
  selected: prop.number,
  onClick: prop.func.isRequired,
  items: prop.instanceOf(List),
}

export default Menu
