import { createStore, combineReducers, bindActionCreators, applyMiddleware } from 'redux';
import Immutable from 'immutable';
import { createProvider } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import * as dataReducers from './reducers/dataReducer';
import components from './components';
import settingsComponentObjects from './settingsComponentObjects';
import * as baseSelectors from './selectors/dataSelectors';
import * as composedSelectors from './selectors/composedSelectors';

import { buildGriddleReducer, buildGriddleComponents } from './utils/compositionUtils';
import { getColumnProperties } from './utils/columnUtils';
import { getRowProperties } from './utils/rowUtils';
import { setSortProperties } from './utils/sortUtils';
import { StoreListener } from './utils/listenerUtils';
import { composeSelectors } from './utils/selectorUtils';
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
      storeKey = 'store',
      reduxMiddleware = [],
      listeners = {},
      ...userInitialState
    } = props;

    const rowProperties = getRowProperties(rowPropertiesComponent);
    const columnProperties = getColumnProperties(rowPropertiesComponent);

    //Combine / compose the reducers to make a single, unified reducer
    const reducers = buildGriddleReducer([dataReducers, ...plugins.map(p => p.reducer)]);

    //Combine / Compose the components to make a single component for each component type
    this.components = buildGriddleComponents([components, ...plugins.map(p => p.components), userComponents]);

    this.settingsComponentObjects = Object.assign({}, settingsComponentObjects, ...plugins.map(p => p.settingsComponentObjects), userSettingsComponentObjects);

    this.events = Object.assign({}, events, ...plugins.map(p => p.events));

    //// STEP 1
    //// ==========
    ////
    //// Add all of the 'base' selectors to the list of combined selectors.
    //// The actuall selector functions are wrapped in an object which is used
    //// to keep track of all the data needed to properly build all the
    //// selector dependency trees
    //console.log("Parsing built-in selectors");
    //const combinedSelectors = new Map();
    //const _baseSelectors = _.reduce(baseSelectors, (map, baseSelector, name) => {
    //  const selector = {
    //    name, 
    //    selector: baseSelector,
    //    dependencies: [],
    //    rank: 0,
    //    traversed: false
    //  };
    //  combinedSelectors.set(name, selector);
    //  map.set(name, selector);
    //  return map;
    //}, new Map());

    //// STEP 2
    //// ==========
    ////
    //// Add all of the 'composed' selectors to the list of combined selectors.
    //// Composed selectors use the 'createSelector' function provided by reselect
    //// and depend on other selectors. These new selectors are located in a 
    //// new file named 'composedSelectors' and are now an object that looks like this:
    ////   {
    ////     creator: ({dependency1, dependency2, ...}) => return createSelector(dependency1, dependency2, (...) => (...)),
    ////     dependencies: ["dependency1", "dependency2"]
    ////   }
    //// 'creator' will return the selector when it is run with the dependency selectors
    //// 'dependencies' are the string names of the dependency selectors, these will be used to
    //// build the tree of selectors
    //const _composedSelectors = _.reduce(composedSelectors, (map, composedSelector, name) => {
    //  const selector = {
    //    name,
    //    ...composedSelector,
    //    rank: 0,
    //    traversed: false
    //  };
    //  combinedSelectors.has(name) && console.log(`  Overriding existing selector named ${name}`);
    //  combinedSelectors.set(name, selector);
    //  map.set(name, selector);
    //  return map;
    //}, new Map());

    //// STEP 3
    //// ==========
    ////
    //// Once the built-in 'base' and 'composed' selectors are added to the list,
    //// repeat the same process for each of the plugins.
    ////
    //// Plugins can now redefine a single existing selector without having to
    //// include the full list of dependency selectors since the dependencies
    //// are now created dynamically
    //for (let i in plugins) {
    //  console.log(`Parsing selectors for plugin ${i}`);
    //  const plugin = plugins[i];
    //  _.forOwn(plugin.selectors, (baseSelector, name) => {
    //    const selector = {
    //      name,
    //      selector: baseSelector,
    //      dependencies: [],
    //      rank: 0,
    //      traversed: false
    //    };

    //    // console log for demonstration purposes
    //    combinedSelectors.has(name) && console.log(`  Overriding existing selector named ${name} with base selector`);
    //    combinedSelectors.set(name, selector);
    //  });

    //  _.forOwn(plugin.composedSelectors, (composedSelector, name) => {
    //    const selector = {
    //      name,
    //      ...composedSelector,
    //      rank: 0,
    //      traversed: false
    //    };

    //    // console log for demonstration purposes
    //    combinedSelectors.has(name) && console.log(`  Overriding existing selector named ${name} with composed selector`);
    //    combinedSelectors.set(name, selector);
    //  });
    //}


    //// RANKS
    //// ==========
    ////
    //// The ranks array is populated when running getDependencies
    //// It stores the selectors based on their 'rank'
    //// Rank can be defined recursively as:
    //// - if a selector has no dependencies, rank is 0
    //// - if a selector has 1 or more dependencies, rank is max(all dependency ranks) + 1
    //const ranks = [];

    //// GET DEPENDENCIES
    //// ==========
    ////
    //// getDependencies recursively descends through the dependencies
    //// of a given selector doing several things:
    //// - creates a 'flat' list of dependencies for a given selector,
    //// which is a list of all of its dependencies
    //// - calculates the rank of each selector and fills out the above ranks list
    //// - determines if there are any cycles present in the dependency tree
    ////
    //// It also memoizes the results in the combinedSelectors Map by setting the
    //// 'traversed' flag for a given selector. If a selector has been flagged as
    //// 'traversed', it simply returns the previously calculated dependencies
    //const getDependencies = (node, parents) => {
    //  // if this node has already been traversed
    //  // no need to run the get dependencies logic as they
    //  // have already been computed
    //  // simply return its list of flattened dependencies
    //  if (!node.traversed) {

    //    // if the node has dependencies, add each one to the node's
    //    // list of flattened dependencies and recursively call
    //    // getDependencies on each of them
    //    if (node.dependencies.length > 0) {

    //      const flattenedDependencies = new Set();
    //      for (let dependency of node.dependencies) {
    //        if (!combinedSelectors.has(dependency)) {
    //          const err = `Selector ${node.name} has dependency ${dependency} but this is not in the list of dependencies! Did you misspell something?`;
    //          throw new Error(err);
    //        }

    //        // if any dependency in the recursion chain
    //        // matches one of the parents there is a cycle throw an exception
    //        // this is an unrecoverable runtime error
    //        if (parents.has(dependency)) {
    //          let err = "Dependency cycle detected! ";
    //          for (let e of parents) {
    //            e === dependency ? err += `[[${e}]] -> ` : err += `${e} -> `;
    //          }
    //          err += `[[${dependency}]]`;
    //          console.log(err);
    //          throw new Error(err);
    //        }
    //        flattenedDependencies.add(dependency);
    //        const childParents = new Set(parents);
    //        childParents.add(dependency);
    //        const childsDependencies = getDependencies(combinedSelectors.get(dependency), childParents);
    //        childsDependencies.forEach((key) => flattenedDependencies.add(key))
    //        const childRank = combinedSelectors.get(dependency).rank;
    //        childRank >= node.rank && (node.rank = childRank + 1);
    //      }
    //      node.flattenedDependencies = flattenedDependencies;
    //      node.traversed = true;

    //    } else {

    //      // otherwise, this is a leaf node
    //      // - set the node's rank to 0
    //      // - set the nodes flattenedDependencies to an empty set
    //      node.flattenedDependencies = new Set();
    //      node.traversed = true;
    //    }
    //    ranks[node.rank] || (ranks[node.rank] = new Array());
    //    ranks[node.rank].push(node);
    //  }
    //  return node.flattenedDependencies;
    //};


    //// STEP 4
    //// ==========
    ////
    //// Run getDependencies on each selector in the 'combinedSelectors' list
    //// This fills out the 'ranks' list for use in the next step
    //for (let e of combinedSelectors) {
    //  const [name, selector] = e;
    //  getDependencies(selector, new Set([name]));
    //}

    //// STEP 5
    //// ==========
    ////
    //// Create a flat object of just the actual selector functions
    //const flattenedSelectors = {};
    //for (let rank of ranks) {
    //  for (let selector of rank) {
    //    if (selector.creator) {
    //      const childSelectors = {};
    //      for (let childSelector of selector.dependencies) {
    //        childSelectors[childSelector] = combinedSelectors.get(childSelector).selector;
    //      }
    //      selector.selector = selector.creator(childSelectors);
    //    }
    //    flattenedSelectors[selector.name] = selector.selector;
    //  }
    //}

    ////this.selectors = plugins.reduce((combined, plugin) => ({ ...combined, ...plugin.selectors }), {...selectors});
    //this.selectors = flattenedSelectors;
    this.selectors = composeSelectors(baseSelectors, composedSelectors, plugins);

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
    const initialState = _.merge(
      {
        enableSettings: true,
        textProperties: {
          next: 'Next',
          previous: 'Previous',
          settingsToggle: 'Settings'
        },
      },
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

    this.store = createStore(
      reducers,
      initialState,
      applyMiddleware(..._.compact(_.flatten(plugins.map(p => p.reduxMiddleware))), ...reduxMiddleware) 
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
    const { data, pageProperties, sortProperties } = nextProps;

    this.store.dispatch(actions.updateState({ data, pageProperties, sortProperties }));
  }

  getStoreKey = () => {
    return this.props.storeKey || 'store';
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

export default Griddle;
