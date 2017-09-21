import Griddle from './index';

import * as actions from './actions';
import components from './components';
import * as constants from './constants';
import * as selectors from './selectors/dataSelectors';
import settingsComponentObjects from './settingsComponentObjects';
import utils from './utils';

import LegacyStylePlugin from './plugins/legacyStyle';
import LocalPlugin from './plugins/local';
import PositionPlugin from './plugins/position';
import APlugin from './plugins/aPlugin';
import BPlugin from './plugins/bPlugin';

const plugins = {
  LegacyStylePlugin,
  LocalPlugin,
  PositionPlugin,
  APlugin,
  BPlugin
};

const ColumnDefinition = components.ColumnDefinition;
const RowDefinition = components.RowDefinition;

export default Griddle;
export {
  actions,
  components,
  constants,
  selectors,
  settingsComponentObjects,
  utils,
  plugins,
  ColumnDefinition,
  RowDefinition,
};
