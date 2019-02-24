import merge from 'lodash/merge';
import pickBy from 'lodash/pickBy';
import compact from 'lodash/compact';
import flatten from 'lodash/flatten';
import {
  buildGriddleReducer,
  buildGriddleComponents
} from './compositionUtils';
import { getColumnProperties } from './columnUtils';
import { getRowProperties } from './rowUtils';

function initializer(defaults) {
  if (!this) throw new Error('this missing!');

  const {
    reducer: defaultReducer,
    components,
    settingsComponentObjects,
    selectors,
    styleConfig: defaultStyleConfig,
    ...defaultInitialState
  } = defaults || {};

  const {
    plugins = [],
    data = [],
    children: rowPropertiesComponent,
    events: userEvents = {},
    styleConfig: userStyleConfig = {},
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
  const reducer = buildGriddleReducer([
    defaultReducer,
    ...plugins.map(p => p.reducer)
  ]);

  // Combine / Compose the components to make a single component for each component type
  this.components = buildGriddleComponents([
    components,
    ...plugins.map(p => p.components),
    userComponents
  ]);

  this.settingsComponentObjects = Object.assign(
    { ...settingsComponentObjects },
    ...plugins.map(p => p.settingsComponentObjects),
    userSettingsComponentObjects
  );

  this.events = Object.assign({}, userEvents, ...plugins.map(p => p.events));

  this.selectors = plugins.reduce(
    (combined, plugin) => ({ ...combined, ...plugin.selectors }),
    { ...selectors }
  );

  const styleConfig = merge(
    { ...defaultStyleConfig },
    ...plugins.map(p => p.styleConfig),
    userStyleConfig
  );

  // TODO: This should also look at the default and plugin initial state objects
  const renderProperties = Object.assign(
    {
      rowProperties,
      columnProperties
    },
    ...plugins.map(p => p.renderProperties),
    userRenderProperties
  );

  // TODO: Make this its own method
  const initialState = merge(
    defaultInitialState,
    ...plugins.map(p => p.initialState),
    userInitialState,
    {
      data,
      renderProperties,
      styleConfig
    }
  );

  const sanitizedListeners = pickBy(
    listeners,
    value => typeof value === 'function'
  );
  this.listeners = plugins.reduce(
    (combined, plugin) => ({
      ...combined,
      ...pickBy(plugin.listeners, value => typeof value === 'function')
    }),
    sanitizedListeners
  );

  return {
    initialState,
    reducer,
    reduxMiddleware: compact([
      ...flatten(plugins.map(p => p.reduxMiddleware)),
      ...reduxMiddleware
    ])
  };
}

export default initializer;
