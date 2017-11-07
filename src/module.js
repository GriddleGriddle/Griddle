import Griddle from './index';

import * as actions from './plugins/core/actions';
import components from './plugins/core/components';
import * as constants from './plugins/core/constants';
import * as selectors from './plugins/core/selectors/dataSelectors';
import settingsComponentObjects from './settingsComponentObjects';
import utils from './utils';

import LegacyStylePlugin from './plugins/legacyStyle';
import LocalPlugin from './plugins/local';
import PositionPlugin from './plugins/position';

const plugins = {
  LegacyStylePlugin,
  LocalPlugin,
  PositionPlugin
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
