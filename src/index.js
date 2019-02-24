import {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose
} from 'redux';
import { createProvider } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import corePlugin from './core';
import init from './utils/initializer';
import { StoreListener } from './utils/listenerUtils';
import * as actions from './actions';

class Griddle extends Component {
  static childContextTypes = {
    components: PropTypes.object.isRequired,
    settingsComponentObjects: PropTypes.object,
    events: PropTypes.object,
    selectors: PropTypes.object,
    storeKey: PropTypes.string,
    storeListener: PropTypes.object
  };

  constructor(props) {
    super(props);

    const { core = corePlugin, storeKey = Griddle.storeKey || 'store' } = props;

    const { initialState, reducer, reduxMiddleware } = init.call(this, core);

    const composeEnhancers =
      (typeof window !== 'undefined' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
      compose;
    this.store = createStore(
      reducer,
      initialState,
      composeEnhancers(applyMiddleware(...reduxMiddleware))
    );

    this.provider = createProvider(storeKey);

    this.storeListener = new StoreListener(this.store);
    _.forIn(this.listeners, (listener, name) => {
      this.storeListener.addListener(listener, name, {
        events: this.events,
        selectors: this.selectors
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const newState = _.pickBy(nextProps, (value, key) => {
      return this.props[key] !== value;
    });

    // Only update the state if something has changed.
    if (Object.keys(newState).length > 0) {
      this.store.dispatch(actions.updateState(newState));
    }
  }

  shouldComponentUpdate() {
    // As relevant property updates are captured in `componentWillReceiveProps`.
    // return false to prevent the the entire root node from being deleted.
    return false;
  }

  getStoreKey = () => {
    return this.props.storeKey || Griddle.storeKey || 'store';
  };

  getChildContext() {
    return {
      components: this.components,
      settingsComponentObjects: this.settingsComponentObjects,
      events: this.events,
      selectors: this.selectors,
      storeKey: this.getStoreKey(),
      storeListener: this.storeListener
    };
  }

  render() {
    if (!this.components.Layout) {
      return null;
    }

    return (
      <this.provider store={this.store}>
        <this.components.Layout />
      </this.provider>
    );
  }
}

Griddle.storeKey = 'store';

export default Griddle;
