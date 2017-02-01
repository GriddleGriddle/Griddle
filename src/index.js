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
import * as actions from './actions';

const defaultEvents = {
  ...actions,
  onFilter: actions.setFilter,
  setSortProperties: ({setSortColumn, sortProperty, columnId}) => {
    return function(event) {
      if (sortProperty === null) {
        setSortColumn({ id: columnId, sortAscending: true });
        return;
      }

      const newSortProperty = {
        ...sortProperty,
        sortAscending: !sortProperty.sortAscending
      };

      setSortColumn(newSortProperty);
    };
  }
};

class Griddle extends Component {
  static childContextTypes = {
    components: React.PropTypes.object.isRequired,
    settingsComponentObjects: React.PropTypes.object,
    events: React.PropTypes.object,
    selectors: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    const { plugins=[], data, children:rowPropertiesComponent, events={}, sortProperties={}, styleConfig={}, pageProperties:importedPageProperties } = props;

    const rowProperties = getRowProperties(rowPropertiesComponent);
    const columnProperties = getColumnProperties(rowPropertiesComponent);

    //Combine / compose the reducers to make a single, unified reducer
    const reducers = buildGriddleReducer([dataReducers, ...plugins.map(p => p.reducer)]);

    //Combine / Compose the components to make a single component for each component type
    this.components = buildGriddleComponents([components, ...plugins.map(p => p.components)]);

    this.settingsComponentObjects = Object.assign({}, settingsComponentObjects, ...plugins.map(p => plugins.settingsComponentObjects));

    this.events = Object.assign({}, events, ...plugins.map(p => plugins.events));

    this.selectors = plugins.reduce((combined, plugin) => ({ ...combined, ...plugin.selectors }), {...selectors});

    const pageProperties = Object.assign({}, {
        currentPage: 1,
        pageSize: 10
      },
      importedPageProperties,
    );

    //TODO: This should also look at the default and plugin initial state objects
    const renderProperties = {
      rowProperties,
      columnProperties
    };

    const initialState = plugins.reduce((combined, plugin) => {
      return !!plugin.initialState ? { ...combined, ...plugin.initialState } : combined;
    }, {
      renderProperties,
      data,
      enableSettings: true,
      pageProperties,
      textProperties: {
        settingsToggle: 'Settings'
      },
      styleConfig: {
        icons: {
          TableHeadingCell: {
            sortDescendingIcon: '▼',
            sortAscendingIcon: '▲'
          },
        },
        classNames: {
          Filter: 'griddle-filter',
          Pagination: 'griddle-pagination',
          Row: 'griddle-row',
          RowDefinition: 'griddle-row-definition',
          Settings: 'griddle-settings',
          SettingsToggle: 'griddle-settings-toggle',
          Table: 'griddle-table',
          TableBody: 'griddle-table-body',
          TableHeading: 'griddle-table-heading',
          TableHeadingCell: {
            container: 'griddle-table-heading-cell',
            ascending: 'griddle-heading-ascending',
            descending: 'griddle-heading-descending',
          },
        },
        styles: {

        }
      },
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
