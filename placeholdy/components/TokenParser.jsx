import React, {PropTypes as prop} from 'react'
import OverlayBubble from 'ui-modal/components/OverlayBubble'
import Token from './Token'
import '../style.scss'


var tokenKey = 0


/**
 * TokenParser main function
 * @method TokenParser
 * @param  {string}    content       Template string
 * @param  {func}      checkValidity Redux action handler for single field validation
 */
export const TokenParser = ({raw, content, tokens, fields, checkValidity, setFieldValue}) => {

  return (
    <section style={{position: 'relative'}}>

      {/* <OverlayBubble ref={ov => popup = ov} /> */}

      <div  className='originalContent'
            id={'template-token-' + tokenKey++}
            dangerouslySetInnerHTML={{__html: content}}
      />
    <div>
      {tokens.map((field, n) => {
        let {prefix, options} = field.toJS()
        let name = ['tok', prefix, n].join('_')
        let fld = fields.get(n)
        fld =  fld ? (fld.toArray ? fld.toArray() : fld) : []
        return (
          <Token
            iter={n}
            key={n}
            name={name}
            type={prefix}
            fields={fld}
            setFieldValue={(val) => setFieldValue(prefix, n, val)}>
            {options}
          </Token>
      )})}

    </div>
    </section>
  )
}

TokenParser.propTypes = {
  content: prop.any.isRequired,
  tokens: prop.object.isRequired,
  fields: prop.object.isRequired,
  type: prop.oneOf(['checkbox', 'radio', 'text', null]),
  checkValidity: prop.func.isRequired,
  setFieldValue: prop.func.isRequired
}


export default TokenParser
