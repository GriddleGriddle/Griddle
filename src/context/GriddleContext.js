import React, { createContext, Component } from 'react';

const initialState = {
  components: {},
  settingsComponentObjects: {},
  events: {},
  selectors: {},
  storeListener: {}
};
const GriddleContext = createContext(initialState);
export default GriddleContext;

// export default class GriddleContextProvider extends Component {
//   state = {
//     components: null,
//     settingsComponentObjects: null,
//     events: null,
//     selectors: null,
//     storeListener: null
//   };
//   setGriddleContext = (components, settingsComponentObjects, events, selectors, storeListener) => {
//     this.setState({ components, settingsComponentObjects, events, selectors, storeListener });
//   };
//   render() {
//     return (
//       <GriddleContext.Provider value={{ ...this.state, setGriddleContext: this.setGriddleContext }}>
//         {this.props.children}
//       </GriddleContext.Provider>
//     );
//   }
// }
