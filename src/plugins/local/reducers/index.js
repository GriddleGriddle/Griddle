import Immutable from 'immutable';
import { maxPageSelector, currentPageSelector } from '../selectors/localSelectors';

import * as dataReducers from '../../../reducers//dataReducer';

export function GRIDDLE_INITIALIZED(state) {
  return dataReducers.GRIDDLE_INITIALIZED(state);
}
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

export function GRIDDLE_NEXT_PAGE(state, action) {
  const maxPage = maxPageSelector(state);
  const currentPage = currentPageSelector(state);

  if(currentPage < maxPage) {
    return state.setIn(['pageProperties', 'currentPage'], currentPage + 1);
  }

  return state;
}

export function GRIDDLE_PREVIOUS_PAGE(state, action) {
  const currentPage = currentPageSelector(state);

  if(currentPage > 0) {
    return state.setIn(['pageProperties', 'currentPage'], currentPage - 1);
  }

  return state;
}

/** Sets the current filter
 * @param {Immutable} state - Immutable state object
 * @param {Object} action - the action object to work with
 *
 */
export function GRIDDLE_SET_FILTER(state, action) {
  return state
    .set('filter', action.filter && Immutable.fromJS(action.filter))
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
