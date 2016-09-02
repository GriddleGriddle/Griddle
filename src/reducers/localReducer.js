import Immutable from 'immutable';

import {
  addKeyToCollection
} from '../utils/dataUtils';

import * as dataReducers from './dataReducer';

/** Sets the Griddle data
 * @param {Immutable} state - Immutable state object
 * @param {Object} action - the action object to work with
 *
 * This simply wraps dataReducer
 */
export function GRIDDLE_LOADED_DATA(state, action) {
  return dataReducers.GRIDDLE_LOADED_DATA(state, action);
}

/** Sets the page size
 * @param {Immutable} state - Immutable state object
 * @param {Object} action - the action object to work with
 *
 * This simply wraps dataReducer
 */
export function GRIDDLE_SET_PAGE_SIZE(state, action) {
  return dataReducers.GRIDDLE_SET_PAGE_SIZE(state, action);
}

/** Sets the current page
 * @param {Immutable} state - Immutable state object
 * @param {Object} action - the action object to work with
 *
 * This simply wraps dataReducer
 */
export function GRIDDLE_SET_PAGE(state, action) {
  return dataReducers.GRIDDLE_SET_PAGE(state, action);
}

/*
 * TODO: Either remove this code or add it back in a working state
export function GRIDDLE_NEXT_PAGE(state, action) {
  return state;
}

export function GRIDDLE_PREVIOUS_PAGE(state, action) {
  return state;
}
*/

/** Sets the current filter
 * @param {Immutable} state - Immutable state object
 * @param {Object} action - the action object to work with
 *
 */
export function GRIDDLE_SET_FILTER(state, action) {
  return state
    .set('filter', action.filter)
    .setIn(['pageProperties', 'currentPage'], 1);
};

/** Sets the sort options
 * @param {Immutable} state - Immutable state object
 * @param {Object} action - the action object to work with
 *
 * This simply wraps dataReducer
 */
export function GRIDDLE_SET_SORT(state, action) {
  return dataReducers.GRIDDLE_SET_SORT(state, action);
};
