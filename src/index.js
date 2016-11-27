import { createStore, combineReducers, bindActionCreators } from 'redux';
import Immutable from 'immutable';
import { connect, Provider } from 'react-redux';
import React, { Component } from 'react';

import * as dataReducers from '../src/reducers/dataReducer';
import components from './components';
import settingsComponentObjects from './settingsComponentObjects';
import * as selectors from './selectors/dataSelectors';

import { buildGriddleReducer, buildGriddleComponents } from './utils/compositionUtils';
import { getColumnProperties } from './utils/columnUtils';
import { getRowProperties } from './utils/rowUtils';
import { updateState } from './actions';

class Griddle extends Component {
  static childContextTypes = {
    components: React.PropTypes.object.isRequired,
    settingsComponentObjects: React.PropTypes.object,
    events: React.PropTypes.object,
    selectors: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    const { plugins=[], data, children:rowPropertiesComponent, events={}, sortProperties={} } = props;

    const rowProperties = getRowProperties(rowPropertiesComponent);
    const columnProperties = getColumnProperties(rowPropertiesComponent);

    //Combine / compose the reducers to make a single, unified reducer
    const reducers = buildGriddleReducer([dataReducers, ...plugins.map(p => p.reducer)]);

    //Combine / Compose the components to make a single component for each component type
    this.components = buildGriddleComponents([components, ...plugins.map(p => p.components)]);

    this.settingsComponentObjects = Object.assign({}, settingsComponentObjects, ...plugins.map(p => plugins.settingsComponentObjects));

    this.events = Object.assign({}, events, ...plugins.map(p => plugins.events));

    this.selectors = Object.assign({}, selectors, ...plugins.map(p => plugins.selectors));

    //TODO: This should also look at the default and plugin initial state objects
    const renderProperties = {
      rowProperties,
      columnProperties
    };

    const initialState = {
      renderProperties,
      data,
      enableSettings: true,
      pageProperties: {
        currentPage: 1,
        pageSize: 10
      },
      textProperties: {
        settingsToggle: 'Settings'
      },
      styles: {
        icons: {
          sortDescending: '▼',
          sortAscending: '▲'
        },
        classNames: {
          column: 'griddle-column',
          filter: 'griddle-filter',
          noResults: 'griddle-noResults',
          loading: 'griddle-loadingResults',
          pagination: 'griddle-pagination',
          rowDefinition: 'griddle-row-definition',
          row: 'griddle-row',
          settingsToggle: 'griddle-settings-toggle',
          settings: 'griddle-settings',
          tableBody: 'griddle-table-body',
          tableHeading: 'griddle-table-heading',
          tableHeadingCell: 'griddle-table-heading-cell',
          tableHeadingCellAscending: 'griddle-heading-ascending',
          tableHeadingCellDescending: 'griddle-heading-descending',
          table: 'griddle-table',
        }
      }
    }

    this.store = createStore(
      reducers,
      initialState
    );
  }

  componentWillReceiveProps(nextProps) {
    const { data, pageProperties, sortProperties } = nextProps;

    this.store.dispatch(updateState({ data, pageProperties, sortProperties }));
  }

  getChildContext() {
    return {
      components: this.components,
      settingsComponentObjects: this.settingsComponentObjects,
      events: this.events,
      selectors: this.selectors,
    };
  }

  render() {
    return (
      <Provider store={this.store}>
        <this.components.Layout />
      </Provider>
    )

  }
}

export default Griddle;
