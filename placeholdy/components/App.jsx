import React from "react";
import FilteredMenu from "../containers/FilteredMenu";

const App = (props) => {
  return (
    <FilteredMenu opts={props.opts}/>
  )
}

export default App
