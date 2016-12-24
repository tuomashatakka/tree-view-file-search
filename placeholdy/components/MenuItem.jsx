/**
 * Created by julius on 26.9.2016.
 */

import React, {PropTypes as prop} from "react";

var style = {
  color: "#555555",
  fontStyle: "italic",
  "float": "right",
}

const MenuItem = ({value, label, selected, onClick}) => {
  return (
    <li className={selected ? 'active' : 'default'}>
      <a
        href="javascript: undefined;"
        onClick={onClick}>
        {label}

        <span style={style}>
          {value}

        </span>
      </a>
    </li>
  )
}

MenuItem.propTypes = {
  label: prop.string.isRequired,
  value: prop.string.isRequired,
  selected: prop.bool,
  onClick: prop.func
}

export default MenuItem
