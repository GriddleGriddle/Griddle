import Griddle from './index';

import * as actions from './actions';
import components from './components';
import * as constants from './constants';
import * as selectors from './selectors/dataSelectors';
import settingsComponentObjects from './settingsComponentObjects';
import utils from './utils';

import CorePlugin from './core';
import LegacyStylePlugin from './plugins/legacyStyle';
import LocalPlugin from './plugins/local';
import LocalCustomPlugin from './plugins/localCustomPlugin';
import PositionPlugin from './plugins/position';

const plugins = {
  CorePlugin,
  LegacyStylePlugin,
  LocalPlugin,
  LocalCustomPlugin,
  PositionPlugin,
};

const ColumnDefinition = components.ColumnDefinition;
const RowDefinition = components.RowDefinition;

const connect = utils.connect;

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
  connect,
};
