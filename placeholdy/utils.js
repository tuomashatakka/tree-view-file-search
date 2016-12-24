/**
 * Placeholdy utility functions
 * Created by Tuomas Hatakka @ 8.11.2016
 *
 * @exports functions
 *    resolveFields(content),
 *    options(fld),
 *    handlePrefix(contents=''),
 *    moveToContainer(field)
 */
import {
  PATTERN, DELIM_DEFAULT, DELIM_RADIO, DELIM_CHECKBOXES, TYPE_TEXTFIELD, TYPE_CHECKBOX, TYPE_RADIO
} from './reducers/assignment'
var insertIter = 0


/**
 * Appends the generated field (Token) to the actual template
 * @method moveToContainer
 * @param  {HTMLNode}        field  React reference based HTML node
 */
export const moveToContainer = (field, opts={}) => {
  let iter = opts.iter || opts.iter === 0 ? opts.iter : insertIter++
  let method = 'append'
  if(opts.replace) method = 'html'
  $($('.highlight-label').get(iter))[method](field)
}


/**
 * Parses the field instances from the string input
 * @method resolveFields
 * @param  {string}      content Contents of the template
 * @return {[array, string]}     An array containing a list of found tokens and
 *                               the parsed output as a string
 */
export const resolveFields = (content, fields=null) => {
  let tokens = [], n = 0
  insertIter = 0
  content = content.replace(PATTERN, (...attr) => {
    let data = options(attr[2])
    if(data.length === 1)
      data.prefix = "text"
    tokens.push(data)
    if(!fields)
      return "<span class='highlight-label'>" + data.options.join(', ') + "</span>"

    let field = fields.get(n++)
    let out = field ? (field.join ? field.join(', ') : field) : ''
    return out
  })
  return {tokens, content}
}


/**
 * Parses the options from a token
 * @method options
 * @param  {object} fld Field to be parsed
 * @return {object}     Returns an object with a prefix and the options as an array
 */
export const options = (fld) => {
  let [prefix, content, delimiter] = handlePrefix(fld)
  return {
    prefix: prefix,
    options: content.split ? content.split(delimiter).map(o => o.trim()) : content }
}


/**
 * Finds the prefix in the template string if there is one
 * @method handlePrefix
 * @param  {string}     [contents=''] Template content string
 * @return {array}                    Prefix and the parsed version of the string content
 */
export const handlePrefix = (contents='') => {
  let prefixed = contents.trim ? contents.trim().search(/\(\w*\)/g) === 0 : false
  let isCheckbox = contents.indexOf(DELIM_CHECKBOXES) !== -1
  let isRadio = contents.indexOf(DELIM_RADIO) !== -1
  let isTextfield = !isCheckbox && !isRadio

  let prefix = (
    isTextfield ? TYPE_TEXTFIELD :
    isRadio ? TYPE_RADIO : TYPE_CHECKBOX
  )
  let delimiter = prefix == TYPE_RADIO ? DELIM_RADIO : DELIM_DEFAULT
  if(prefixed) {
    contents = contents.replace(/\(\w*\)/g, (a) => {
      prefix = a.trim().substr(1, a.trim().length-2)
      return ""
    })
    delimiter = DELIM_DEFAULT
  }
  return [prefix, contents, delimiter]
}
