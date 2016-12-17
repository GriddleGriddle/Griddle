import components from './components';
import * as reducer from './reducers';
import initialState from './initial-state';

const PositionPlugin = (config) => {
  return {
    initialState: {
      ...initialState,
      positionSettings: {
        positionSettings: initialState.positionSettings,
        ...config,
      },
    },
    components,
    reducer,
  };
}

export default PositionPlugin;
