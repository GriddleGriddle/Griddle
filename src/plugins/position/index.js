import components from './components';
import * as reducer from './reducers';

const PositionPlugin = (config) => {
  return {
    initialState: config,
    components,
    reducer,
  };
}

export default PositionPlugin;
