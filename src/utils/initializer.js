import _ from 'lodash';
import { buildGriddleReducer, buildGriddleComponents } from './compositionUtils';
import { getColumnProperties } from './columnUtils';
import { getRowProperties } from './rowUtils';

module.exports = function initializer(defaults) {
  if (!this) throw new Error('this missing!');

  const {
    reducers: dataReducers,
    components,
    settingsComponentObjects,
    selectors,
    styleConfig: defaultStyleConfig,
    pageProperties: defaultPageProperties,
    ...defaultInitialState
  } = defaults;

  const {
    plugins = [],
    data = [],
    children: rowPropertiesComponent,
    events: userEvents = {},
    sortProperties = {},
    styleConfig: userStyleConfig = {},
    pageProperties: userPageProperties,
    components: userComponents,
    renderProperties: userRenderProperties = {},
    settingsComponentObjects: userSettingsComponentObjects,
    reduxMiddleware = [],
    listeners = {},
    ...userInitialState
  } = this.props;

  const rowProperties = getRowProperties(rowPropertiesComponent);
  const columnProperties = getColumnProperties(rowPropertiesComponent);

  // Combine / compose the reducers to make a single, unified reducer
  const reducers = buildGriddleReducer([dataReducers, ...plugins.map(p => p.reducer)]);

  // Combine / Compose the components to make a single component for each component type
  this.components = buildGriddleComponents([
    components,
    ...plugins.map(p => p.components),
    userComponents,
  ]);

  this.settingsComponentObjects = Object.assign(
    { ...settingsComponentObjects },
    ...plugins.map(p => p.settingsComponentObjects),
    userSettingsComponentObjects);

  this.events = Object.assign({}, userEvents, ...plugins.map(p => p.events));

  this.selectors = plugins.reduce(
    (combined, plugin) => ({ ...combined, ...plugin.selectors }),
    { ...selectors });

  const styleConfig = _.merge(
    { ...defaultStyleConfig },
    ...plugins.map(p => p.styleConfig),
    userStyleConfig);

  const pageProperties = Object.assign({}, defaultPageProperties, userPageProperties);

  // TODO: This should also look at the default and plugin initial state objects
  const renderProperties = Object.assign({
    rowProperties,
    columnProperties
  }, ...plugins.map(p => p.renderProperties), userRenderProperties);

  // TODO: Make this its own method
  const initialState = _.merge(
    defaultInitialState,
    ...plugins.map(p => p.initialState),
    userInitialState,
    {
      data,
      pageProperties,
      renderProperties,
      sortProperties,
      styleConfig,
    }
  );

  const sanitizedListeners = _.pickBy(listeners, value => typeof value === 'function');
  this.listeners = plugins.reduce((combined, plugin) => ({ ...combined, ..._.pickBy(plugin.listeners, value => typeof value === 'function') }), sanitizedListeners);

  return {
    initialState,
    reducers,
    reduxMiddleware: [
      ..._.compact(_.flatten(plugins.map(p => p.reduxMiddleware))),
      ...reduxMiddleware
    ],
  };
};
