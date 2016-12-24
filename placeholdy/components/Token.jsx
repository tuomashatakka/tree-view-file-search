import React, {PropTypes as prop} from 'react'
import {moveToContainer} from '../utils'
import {SelectionField, TextField, TYPE_CHECKBOX, TYPE_RADIO} from 'formfields'


/**
 * A single field instance that is transformed into an actual html input
 * @method Token
 * @param  {array}  children      Choices
 * @param  {string} name          Name attr of the input field
 * @param  {string} type          Type attribute of the field
 * @param  {func}   setFieldValue Handler for checking if the field is valid
 */
const Token = ({iter, children, name, type, fields, setFieldValue}) => {
  return (
    <div style={{display: 'inline-block'}}
         ref={fld => moveToContainer(fld, {replace: true, iter: iter})}>
      {children.map((opt, key) => {
        let FieldType
        if (type === 'text')
          FieldType = (TextField)
        else
          FieldType = (SelectionField)

        return <FieldType
          key={(100*iter + key).toString() + name}
          type={type === 'radio' ? 1 : 0}
          name={name}
          value={opt}
          active={!(fields.indexOf ? fields.indexOf(opt) === -1 : (fields == opt))}
          handleChange={(target) => setFieldValue(target.value)}>
          {opt}
        </FieldType>
      }
      )}
    </div>
  )
}

Token.propTypes = {
  iter: prop.number,
  children: prop.any,
  fields: prop.any,
  name: prop.string.isRequired,
  type: prop.oneOf(['checkbox', 'radio', 'text', null]),
  setFieldValue: prop.func.isRequired
}


export default Token
