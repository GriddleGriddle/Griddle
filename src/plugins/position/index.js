import components from './components';
import * as reducer from './reducers';
import initialState from './initial-state';
import * as selectors from './selectors';

const PositionPlugin = (config) => {
  return {
    initialState: {
      ...initialState,
      positionSettings: Object.assign({}, initialState.positionSettings, config),
    },
    components,
    reducer,
    selectors,
  };
}

export default PositionPlugin;
