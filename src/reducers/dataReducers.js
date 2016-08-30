import Immutable from 'immutable';

import {
  addKeyToCollection
} from '../utils/dataUtils';

/** Sets the default render properties
 * @param {Immutable} state- Immutable previous state object
 * @param {Object} action - The action object to work with
*/
//TODO: Consider renaming this to be more in line with what it's actually doing
export function GRIDDLE_INITIALIZED(state, action) {
  return state.set('renderProperties', Immutable.fromJS(action.properties));
}

/** Sets the griddle data
 * @param {Immutable} state- Immutable previous state object
 * @param {Object} action - The action object to work with
*/
export function GRIDDLE_LOADED_DATA(state, action, helpers) {
  return state.set('data', addKeyToCollection(Immutable.fromJS(action.data)))
    .set('loading', false);
}
