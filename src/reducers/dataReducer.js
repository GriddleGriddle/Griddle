import Immutable from 'immutable';

/*
 * State
 * ------------------
 *  data {Immutable.List} - the data that the grid is displaying
 *  loading {boolean} - is the data currently loading
 *  renderProperties {Immutable.Map} - the properties that determine how the grid should be displayed
 *  pageProperties {Immutable.Map} - the metadata for paging information
 *  .-- currentPage {int} - The current, visible page
 *  .-- pageSize {int} - The number of records to display
 *  sortProperties {Immutable.List} - the metadata surrounding sort
 *  .-- id {string} - the column id
 *  .-- sortAscending {boolean} - the direction of the sort. Index matches that of sortColumns
 **/
import {
  addKeyToCollection
} from '../utils/dataUtils';

/** Sets the default render properties
 * @param {Immutable} state- Immutable previous state object
 * @param {Object} action - The action object to work with
 *
 * TODO: Consider renaming this to be more in line with what it's actually doing (setting render properties)
*/
export function GRIDDLE_INITIALIZED(initialState) {
  return Immutable.fromJS(initialState);
}

/** Sets the griddle data
 * @param {Immutable} state- Immutable previous state object
 * @param {Object} action - The action object to work with
*/
export function GRIDDLE_LOADED_DATA(state, action, helpers) {
console.log(action);
debugger;
  return state.set('data', addKeyToCollection(Immutable.fromJS(action.data)))
    .set('loading', false);
}

/** Sets the current page size
 * @param {Immutable} state- Immutable previous state object
 * @param {Object} action - The action object to work with
*/
export function GRIDDLE_SET_PAGE_SIZE(state, action) {
  return state.setIn(['pageProperties', 'pageSize'], action.pageSize);
}

/** Sets the current page
 * @param {Immutable} state- Immutable previous state object
 * @param {Object} action - The action object to work with
*/
export function GRIDDLE_SET_PAGE(state, action) {
  return state.setIn(['pageProperties', 'currentPage'], action.pageNumber);
}

/** Sets the filter
 * @param {Immutable} state- Immutable previous state object
 * @param {Object} action - The action object to work with
*/
export function GRIDDLE_SET_FILTER(state, action) {
  return state.set('filter', action.filter);
}

/** Sets sort properties
 * @param {Immutable} state- Immutable previous state object
 * @param {Object} action - The action object to work with
*/
export function GRIDDLE_SET_SORT(state, action) {
  return state.set('sortProperties', new Immutable.List(action.sortProperties));
}
