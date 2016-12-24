/**
 * Created by tuomas on 3.10.2016.
 */

import {connect} from "react-redux";
import { checkValidity, outputRaster, setFieldValue } from "../actions";
import TokenParser from "../components/TokenParser";


const AssignmentForm = connect(

  // Map state to props
  (state) => {
    let tokens = state.get('tokens')
    let raw = state.get('raw')
    let content = state.get('content')
    let fields = state.get('fields')

    return { raw, content, fields, tokens }
  },

  // Map dispatch to props
  (dispatch) => ({
    setFieldValue:  (typ, n, val)   => dispatch(setFieldValue(typ, n, val)),
    checkValidity:  (opts)          => dispatch(checkValidity(opts)),
    outputRaster:   (opts)          => dispatch(outputRaster(opts))})

)(TokenParser)

export default AssignmentForm
