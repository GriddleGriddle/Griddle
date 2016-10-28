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
  let tempState = Object.assign({}, initialState);
  //TODO: could probably make this more efficient by removing data
  // making the rest of the properties initial state and 
  // setting the mapped data on the new initial state immutable object
  if(initialState.hasOwnProperty('data') &&
    initialState.data.length > 0 &&
    !initialState.data[0].hasOwnProperty('griddleKey')) {
      tempState.data = addKeyToCollection(Immutable.fromJS(initialState.data));
  } 

  return Immutable.fromJS(tempState);
}

/** Sets the griddle data
 * @param {Immutable} state- Immutable previous state object
 * @param {Object} action - The action object to work with
*/
export function GRIDDLE_LOADED_DATA(state, action, helpers) {
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
  // turn this into an array if it's not already
  const sortProperties = action.sortProperties.hasOwnProperty('length') ?
    action.sortProperties :
    [action.sortProperties];

  return state.set('sortProperties', new Immutable.fromJS(sortProperties));
}

/** Sets the settings visibility to true / false depending on the current property
 */
export function GRIDDLE_TOGGLE_SETTINGS(state, action) {
  // if undefined treat as if it's false
  const showSettings = state.get('showSettings') || false;

  return state.set('showSettings', !showSettings);
}
