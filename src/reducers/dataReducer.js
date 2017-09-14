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
  addColumnPropertiesWhenNoneExist,
  transformData,
} from '../utils/dataUtils';

function isColumnVisible(state, columnId) {
  const hasRenderProperty = state.getIn(['renderProperties', 'columnProperties', columnId]);
  const currentlyVisibleProperty = state.getIn(['renderProperties', 'columnProperties', columnId, 'visible']);

  // if there is a render property and visible is not set, visible is true
  if (hasRenderProperty && currentlyVisibleProperty === undefined) {
    return true;
  }

  // if there is no render property currently and visible is not set 
  if (!hasRenderProperty && currentlyVisibleProperty === undefined) {
    return false;
  }

  return currentlyVisibleProperty;
}


/** Sets the default render properties
 * @param {Immutable} state- Immutable previous state object
 * @param {Object} action - The action object to work with
 *
 * TODO: Consider renaming this to be more in line with what it's actually doing (setting render properties)
*/
export function GRIDDLE_INITIALIZED(initialState) {
  let tempState = Object.assign({}, initialState);
  tempState = addColumnPropertiesWhenNoneExist(tempState);
  //TODO: could probably make this more efficient by removing data
  // making the rest of the properties initial state and
  // setting the mapped data on the new initial state immutable object
  if (initialState.data &&
    initialState.data.length > 0) {
      const transformedData = transformData(initialState.data, initialState.renderProperties);
      tempState.data = transformedData.data;
      tempState.lookup = transformedData.lookup;
  }

  return Immutable.fromJS(tempState);
}

/** Sets the griddle data
 * @param {Immutable} state- Immutable previous state object
 * @param {Object} action - The action object to work with
*/
export function GRIDDLE_LOADED_DATA(state, action) {
  const transformedData = transformData(action.data, state.get('renderProperties').toJSON());

  return state
    .set('data', transformedData.data)
    .set('lookup', transformedData.lookup)
    .set('loading', false);
}

/** Sets the current page size
 * @param {Immutable} state- Immutable previous state object
 * @param {Object} action - The action object to work with
*/
export function GRIDDLE_SET_PAGE_SIZE(state, action) {
  return state
    .setIn(['pageProperties', 'currentPage'], 1)
    .setIn(['pageProperties', 'pageSize'], action.pageSize);
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

export function GRIDDLE_TOGGLE_COLUMN(state, action) {
  // flips the visible state if the column property exists
  const currentlyVisible = isColumnVisible(state, action.columnId);

  return state.getIn(['renderProperties', 'columnProperties', action.columnId]) ?
    state.setIn(['renderProperties', 'columnProperties', action.columnId, 'visible'],
      !currentlyVisible) :

    // if the columnProperty doesn't exist, create a new one and set the property to true
    state.setIn(['renderProperties', 'columnProperties', action.columnId],
      new Immutable.Map({ id: action.columnId, visible: true }));
}

export function GRIDDLE_UPDATE_STATE(state, action) {
  const { data, ...newState } = action.newState;
  const transformedData = transformData(data, state.get('renderProperties').toJSON());

  return state.mergeDeep(Immutable.fromJS(newState))
    .set('data', transformedData.data)
    .set('lookup', transformedData.lookup);
}
