import { createStore, combineReducers, bindActionCreators, applyMiddleware, compose } from 'redux';
import Immutable from 'immutable';
import { createProvider } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

//import * as dataReducers from './reducers/dataReducer';
//import components from './components';
import settingsComponentObjects from './settingsComponentObjects';
//import * as selectors from './selectors/dataSelectors';

import { buildGriddleReducer, buildGriddleComponents } from './utils/compositionUtils';
//import { getColumnProperties } from './utils/columnUtils';
//import { getRowProperties } from './utils/rowUtils';
import { setSortProperties } from './utils/sortUtils';
import { StoreListener } from './utils/listenerUtils';
import { composeSelectors } from './utils/selectorUtils';
//import * as actions from './actions';

import CorePlugin from './plugins/core';

//const defaultEvents = {
//  ...actions,
//  onFilter: actions.setFilter,
//  setSortProperties
//};

class Griddle extends Component {
  static childContextTypes = {
    components: PropTypes.object.isRequired,
    settingsComponentObjects: PropTypes.object,
    events: PropTypes.object,
    selectors: PropTypes.object,
    storeKey: PropTypes.string,
    storeListener: PropTypes.object,
    actions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const {
      baselinePlugin=CorePlugin,
      plugins=[],
      data,
      children:rowPropertiesComponent,
      events={},
      sortProperties={},
      styleConfig={},
      pageProperties:importedPageProperties,
      components:userComponents,
      renderProperties:userRenderProperties={},
      settingsComponentObjects:userSettingsComponentObjects,
      storeKey = Griddle.storeKey || 'store',
      reduxMiddleware = [],
      listeners = {},
      ...userInitialState
    } = props;

    switch(typeof baselinePlugin) {
      case 'function':
        plugins.unshift(baselinePlugin(props));
        break;
      case 'object':
        plugins.unshift(baselinePlugin);
        break;
    };

    this.plugins = plugins;

    //Combine / compose the reducers to make a single, unified reducer
    //const reducers = buildGriddleReducer([dataReducers, ...plugins.map(p => p.reducer)]);
    const reducers = buildGriddleReducer([...plugins.map(p => p.reducer)]);

    //Combine / Compose the components to make a single component for each component type
    //this.components = buildGriddleComponents([components, ...plugins.map(p => p.components), userComponents]);
    this.components = buildGriddleComponents([...plugins.map(p => p.components), userComponents]);

    // NOTE this goes on the context which for the purposes of breaking out the 
    // 'core' code into a plugin is somewhat of a problem as it should
    // be associated with the core code not general griddle code.
    this.settingsComponentObjects = Object.assign({}, ...plugins.map(p => p.settingsComponentObjects), userSettingsComponentObjects);

    this.events = Object.assign({}, events, ...plugins.map(p => p.events));

    this.selectors = composeSelectors(plugins[0].selectors, plugins);

    this.actions = plugins.reduce((combined, plugin) => ({ ...combined, ...plugin.actions }), {});

    const mergedStyleConfig = _.merge({}, ...plugins.map(p => p.styleConfig), styleConfig);

    // this would be good to move into the core plugin
    // and namespace this state to the core plugin
    const pageProperties = Object.assign({}, {
        currentPage: 1,
        pageSize: 10
      },
      importedPageProperties,
    );

    //TODO: This should also look at the default and plugin initial state objects
    const renderProperties = Object.assign(...plugins.map(p => p.renderProperties), userRenderProperties);

    // TODO: Make this its own method
    // It would be nice if state was namespaced to the plugin
    // it was associated with. For example pageProperties and 
    // sortProperties are specific to the core plugin. We could
    // refactor the selectors to grab this data from a different
    // place but would this affect other users?
    const initialState = _.merge(
      ...plugins.map(p => p.initialState),
      userInitialState,
      {
        data,
        pageProperties,
        renderProperties,
        sortProperties,
        styleConfig: mergedStyleConfig,
      }
    );

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    this.store = createStore(
      reducers,
      initialState,
      composeEnhancers(
        applyMiddleware(..._.compact(_.flatten(plugins.map(p => p.reduxMiddleware))), ...reduxMiddleware)
      )
    );

    this.provider = createProvider(storeKey);

    const sanitizedListeners = _.pickBy(listeners, (value, key) => typeof value === "function");
    this.listeners = plugins.reduce((combined, plugin) => ({...combined, ..._.pickBy(plugin.listeners, (value, key) => typeof value === "function")}), {...sanitizedListeners});
    this.storeListener = new StoreListener(this.store);
    _.forIn(this.listeners, (listener, name) => {
      this.storeListener.addListener(listener, name, {events: this.events, selectors: this.selectors});
    });
  }

  componentWillReceiveProps(nextProps) {
    const newState = _.pickBy(nextProps, (value, key) => {
      return this.props[key] !== value;
    })

    // Only update the state if something has changed.
    if (Object.keys(newState).length > 0) {
     this.store.dispatch(this.plugins[0].actions.updateState(newState));
    }
  }

  shouldComponentUpdate() {
    // As relevant property updates are captured in `componentWillReceiveProps`.
    // return false to prevent the the entire root node from being deleted.
    return false;
  }

  getStoreKey = () => {
    return this.props.storeKey || Griddle.storeKey || 'store';
  }

  getChildContext() {
    return {
      components: this.components,
      settingsComponentObjects: this.settingsComponentObjects,
      events: this.events,
      selectors: this.selectors,
      storeKey: this.getStoreKey(),
      storeListener: this.storeListener,
      actions: this.actions,
    };
  }

  render() {
    return (
      <this.provider store={this.store}>
        <this.components.Layout />
      </this.provider>
    )

  }
}

Griddle.storeKey = 'store';

export default Griddle;
