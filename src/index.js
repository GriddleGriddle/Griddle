import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import forIn from 'lodash.forin';
import pickBy from 'lodash.pickby';

import corePlugin from './core';
import init from './utils/initializer';
import { StoreListener } from './utils/listenerUtils';
import * as actions from './actions';
import GriddleContext from './context/GriddleContext';

class Griddle extends Component {
  static childContextTypes = {
    components: PropTypes.object.isRequired,
    settingsComponentObjects: PropTypes.object,
    events: PropTypes.object,
    selectors: PropTypes.object,
    storeListener: PropTypes.object
  };

  constructor(props) {
    super(props);

    const { core = corePlugin } = props;

    const { initialState, reducer, reduxMiddleware } = init.call(this, core);

    const composeEnhancers =
      (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    this.store = createStore(
      reducer,
      initialState,
      composeEnhancers(applyMiddleware(...reduxMiddleware))
    );

    this.storeListener = new StoreListener(this.store);
    forIn(this.listeners, (listener, name) => {
      this.storeListener.addListener(listener, name, {
        events: this.events,
        selectors: this.selectors
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const newState = pickBy(nextProps, (value, key) => {
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

  getChildContext() {
    return {
      components: this.components,
      settingsComponentObjects: this.settingsComponentObjects,
      events: this.events,
      selectors: this.selectors,
      storeListener: this.storeListener
    };
  }

  render() {
    return (
      <GriddleContext.Provider
        value={{
          components: this.components,
          settingsComponentObjects: this.settingsComponentObjects,
          events: this.events,
          selectors: this.selectors,
          storeListener: this.storeListener
        }}
      >
        {this.components.Layout ? (
          <Provider store={this.store}>
            <this.components.Layout />
          </Provider>
        ) : null}
      </GriddleContext.Provider>
    );
  }
}

export default Griddle;
