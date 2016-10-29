import { createStore, combineReducers, bindActionCreators } from 'redux';
import Immutable from 'immutable';
import { connect, Provider } from 'react-redux';
import React, { Component } from 'react';

import * as dataReducers from '../src/reducers/dataReducer';
import components from './components';
import settingsComponentObjects from './settingsComponentObjects';

import { buildGriddleReducer, buildGriddleComponents } from './utils/compositionUtils';
import { getColumnProperties } from './utils/columnUtils';
import { getRowProperties } from './utils/rowUtils';

export default class extends Component {
  static childContextTypes = {
    components: React.PropTypes.object.isRequired,
    settingsComponentObjects: React.PropTypes.object
  }

  constructor(props) {
    super(props);

    const { plugins=[], data, children:rowPropertiesComponent } = props;

    const rowProperties = getRowProperties(rowPropertiesComponent);
    const columnProperties = getColumnProperties(rowPropertiesComponent);

    //Combine / compose the reducers to make a single, unified reducer
    const reducers = buildGriddleReducer([dataReducers, ...plugins.map(p => p.reducer)]);

    //Combine / Compose the components to make a single component for each component type
    this.components = buildGriddleComponents([components, ...plugins.map(p => p.components)]);

    this.settingsComponentObjects = Object.assign({}, settingsComponentObjects, ...plugins.map(p => plugins.settingsComponentObjects));

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

  getChildContext() {
    return {
      components: this.components,
      settingsComponentObjects: this.settingsComponentObjects,
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
