import Immutable from 'immutable';

export const GRIDDLE_LOADED_DATA = (state, action) => (
  state.set('data', action.data)
);
