import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Griddle from './components/GriddleContainer';

/** Gets the combined / composed reducers */
function getCombinedReducers(...reducers) {
  return reducers;
}

let store = createStore(getCombinedReducers(reducers));

return () => (
  <Provider store={store}>
    <Griddle />
  </Provider>
)
