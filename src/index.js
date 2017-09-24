import { createStore, combineReducers, bindActionCreators, applyMiddleware, compose } from 'redux';
import { createProvider } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import * as dataReducers from './reducers/dataReducer';
import components from './components';
import settingsComponentObjects from './settingsComponentObjects';
import * as selectors from './selectors/dataSelectors';

import init from './utils/initializer';
import { setSortProperties } from './utils/sortUtils';
import { StoreListener } from './utils/listenerUtils';
import * as actions from './actions';

const defaultEvents = {
  ...actions,
  onFilter: actions.setFilter,
  setSortProperties
};


const defaultStyleConfig = {
  icons: {
    TableHeadingCell: {
      sortDescendingIcon: '▼',
      sortAscendingIcon: '▲'
    },
  },
  classNames: {
    Cell: 'griddle-cell',
    Filter: 'griddle-filter',
    Loading: 'griddle-loadingResults',
    NextButton: 'griddle-next-button',
    NoResults: 'griddle-noResults',
    PageDropdown: 'griddle-page-select',
    Pagination: 'griddle-pagination',
    PreviousButton: 'griddle-previous-button',
    Row: 'griddle-row',
    RowDefinition: 'griddle-row-definition',
    Settings: 'griddle-settings',
    SettingsToggle: 'griddle-settings-toggle',
    Table: 'griddle-table',
    TableBody: 'griddle-table-body',
    TableHeading: 'griddle-table-heading',
    TableHeadingCell: 'griddle-table-heading-cell',
    TableHeadingCellAscending: 'griddle-heading-ascending',
    TableHeadingCellDescending: 'griddle-heading-descending',
  },
  styles: {
  }
};

class Griddle extends Component {
  static childContextTypes = {
    components: PropTypes.object.isRequired,
    settingsComponentObjects: PropTypes.object,
    events: PropTypes.object,
    selectors: PropTypes.object,
    storeKey: PropTypes.string,
    storeListener: PropTypes.object
  }

  constructor(props) {
    super(props);

    const {
      storeKey = Griddle.storeKey || 'store',
    } = props;

    const { initialState, reducers, reduxMiddleware } = init.call(this, {
      reducers: dataReducers,
      components,
      settingsComponentObjects,
      selectors,
      styleConfig: defaultStyleConfig,

      pageProperties: {
        currentPage: 1,
        pageSize: 10
      },
      enableSettings: true,
      textProperties: {
        next: 'Next',
        previous: 'Previous',
        settingsToggle: 'Settings'
      },
    });

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    this.store = createStore(
      reducers,
      initialState,
      composeEnhancers(
        applyMiddleware(...reduxMiddleware)
      )
    );

    this.provider = createProvider(storeKey);

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
  }

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
    return (
      <this.provider store={this.store}>
        <this.components.Layout />
      </this.provider>
    )

  }
}

Griddle.storeKey = 'store';

export default Griddle;
