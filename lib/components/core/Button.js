'use babel'
import React from 'react'
import Icon from './Icon'

export const Button = ({ children, icon, active, style='default', data={}, onClick=(e)=>console.log(e) }) => {

  let iconset
  if (icon && typeof icon !== 'string')
    ({ icon, iconset } = icon)

  children = [
    (<Icon icon={icon} iconset={iconset} />),
    children
  ]

  let attributes = {}
  for (let key in data) {
    let attr = 'data' + key.charAt(0).toUpperCase() + key.substr(1)
    attributes[attr] = data[key]
  }

  return <button
    onClick={onClick}
    className={`btn btn-${style}${active ? ' selected active' : ''}`}
    {...attributes}>

    {children || null}

  </button>
}


export const FilterButton = (props={}) => {
  props = {
    ...props,
    onClick: () => props.fnc(props.val),
    data: {
      ...(props.data || {}),
      value: props.val
    }
  }
  return <Button {...props} />
}

export default Button
