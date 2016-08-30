import test from 'ava';
import Immutable from 'immutable';

import * as reducers from '../dataReducers';
import constants from '../../constants';

test('initializes data', test => {
  const initializedState = reducers.GRIDDLE_INITIALIZED(new Immutable.Map(),
    { type: 'GRIDDLE_INITIALIZED',
      properties: {
        one: 'one',
        two: 'two'
      }
  });

  test.deepEqual(initializedState.get('renderProperties').toJSON(), {
    one: 'one',
    two: 'two'
  });
});

test('sets data', test => {
  const reducedState = reducers.GRIDDLE_LOADED_DATA(new Immutable.Map(),
    { type: 'GRIDDLE_LOADED_DATA', data: [
      {name: "one"},
      {name: "two"}
    ]}
  );

  test.deepEqual(reducedState.toJSON(), {
    data: [
      {name: "one", griddleKey: 0},
      {name: "two", griddleKey: 1}
    ],
    loading: false
  });
});
