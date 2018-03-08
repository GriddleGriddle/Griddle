import components from '../components';
import * as reducer from '../reducers/dataReducer';
import * as selectors from '../selectors/dataSelectors';
import * as actions from '../actions';
import settingsComponentObjects from '../settingsComponentObjects';
import initialState from './initialState';

const CorePlugin = {
  components,
  settingsComponentObjects,
  reducer,
  selectors,
  actions,
  ...initialState,
};

export default CorePlugin;
