import { createStore, combineReducers, bindActionCreators } from 'redux';
import Immutable from 'immutable';
import { connect, Provider } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import * as dataReducers from './reducers/dataReducer';
import components from './components';
import settingsComponentObjects from './settingsComponentObjects';
import * as selectors from './selectors/dataSelectors';

import { buildGriddleReducer, buildGriddleComponents } from './utils/compositionUtils';
import { getColumnProperties } from './utils/columnUtils';
import { getRowProperties } from './utils/rowUtils';
import { setSortProperties } from './utils/sortUtils';
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
  }

  constructor(props) {
    super(props);

    const { plugins=[], data, children:rowPropertiesComponent, events={}, sortProperties={}, styleConfig={}, pageProperties:importedPageProperties, components:userComponents, renderProperties:userRenderProperties={}, settingsComponentObjects:userSettingsComponentObjects } = props;

    const rowProperties = getRowProperties(rowPropertiesComponent);
    const columnProperties = getColumnProperties(rowPropertiesComponent);

    //Combine / compose the reducers to make a single, unified reducer
    const reducers = buildGriddleReducer([dataReducers, ...plugins.map(p => p.reducer)]);

    //Combine / Compose the components to make a single component for each component type
    this.components = buildGriddleComponents([components, ...plugins.map(p => p.components), userComponents]);

    this.settingsComponentObjects = Object.assign({}, settingsComponentObjects, ...plugins.map(p => p.settingsComponentObjects), userSettingsComponentObjects);

    this.events = Object.assign({}, events, ...plugins.map(p => p.events));

    this.selectors = plugins.reduce((combined, plugin) => ({ ...combined, ...plugin.selectors }), {...selectors});

    const mergedStyleConfig = _.merge({}, defaultStyleConfig, ...plugins.map(p => p.styleConfig), styleConfig);

    const pageProperties = Object.assign({}, {
        currentPage: 1,
        pageSize: 10
      },
      importedPageProperties,
    );

    //TODO: This should also look at the default and plugin initial state objects
    const renderProperties = Object.assign({
      rowProperties,
      columnProperties
    }, ...plugins.map(p => p.renderProperties), userRenderProperties);

    // TODO: Make this its own method
    const initialState = plugins.reduce((combined, plugin) => {
      return !!plugin.initialState ? { ...combined, ...plugin.initialState } : combined;
    }, {
      renderProperties,
      data,
      enableSettings: true,
      pageProperties,
      sortProperties,
      textProperties: {
        settingsToggle: 'Settings'
      },
      styleConfig: mergedStyleConfig,
    });

    this.store = createStore(
      reducers,
      initialState
    );
  }

  componentWillReceiveProps(nextProps) {
    const { data, pageProperties, sortProperties } = nextProps;

    this.store.dispatch(actions.updateState({ data, pageProperties, sortProperties }));
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
