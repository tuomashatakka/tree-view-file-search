'use babel'
import React from 'react'

export default ({icon, iconset='icon'}) =>
  <icon
    className={`icon ${iconset} ${iconset}-${icon}`}
  />
