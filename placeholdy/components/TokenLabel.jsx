import React, {PropTypes as prop} from 'react'


const TokenLabel = ({children}) => (
  <span className='label label-primary'>
  {children}
  </span>
)


TokenLabel.propTypes = {
  children: prop.any
}
