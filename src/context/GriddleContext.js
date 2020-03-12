import React from 'react';

const initialState = {
  components: {},
  settingsComponentObjects: {},
  events: {},
  selectors: {},
  storeListener: {}
};
const GriddleContext = React.createContext(initialState);
export default GriddleContext;
