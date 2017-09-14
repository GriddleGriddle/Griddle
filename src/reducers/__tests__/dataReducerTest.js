import test from 'ava';
import Immutable from 'immutable';

import * as reducers from '../dataReducer';
import constants from '../../constants';

test('initializes data', test => {
  const initializedState = reducers.GRIDDLE_INITIALIZED({
    renderProperties: {
      one: 'one',
      two: 'two'
    }
  });

  test.deepEqual(initializedState.get('renderProperties').toJSON(), {
    one: 'one',
    two: 'two'
  });
});

test('creates column properties if none exist for data', test => {
  const state = reducers.GRIDDLE_INITIALIZED({
    data: [
      {one: 1, two: 2, three: 3},
      {one: 11, two: 22, three: 33}
    ],
    renderProperties: {},
  });

  test.deepEqual(state.getIn(['renderProperties', 'columnProperties']).toJSON(), {
    one: { id: 'one', visible: true },
    two: { id: 'two', visible: true },
    three: { id: 'three', visible: true }
  });
});

test('does not adjust column properties if exists already', test => {
  const state = reducers.GRIDDLE_INITIALIZED({
    data: [
      { one: 1, two: 2, three: 3},
      { one: 11, two: 22, three: 33 }
    ],
    renderProperties: {
      columnProperties: {
        one: { id: 'one', visible: true }
      }
    }
  });

  test.deepEqual(state.getIn(['renderProperties', 'columnProperties']).toJSON(), {
    one: { id: 'one', visible: true }
  });
});

[undefined, null].map(data =>
  test(`does not adjust column properties if data is ${data}`, (assert) => {
    const state = reducers.GRIDDLE_INITIALIZED({
      data,
      renderProperties: {
        columnProperties: {
          one: { id: 'one', visible: true }
        }
      }
    });

    assert.deepEqual(state.getIn(['renderProperties', 'columnProperties']).toJSON(), {
      one: { id: 'one', visible: true }
    });
  })
);

test('sets data', test => {
  const reducedState = reducers.GRIDDLE_LOADED_DATA(Immutable.fromJS({ renderProperties: {} }),
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
    renderProperties: {},
    lookup: { 0: 0, 1: 1 },
    loading: false
  });
});

test('sets the correct page number', test => {
  const state = reducers.GRIDDLE_SET_PAGE(new Immutable.Map(), {
    pageNumber: 2
  });

  test.is(state.getIn(['pageProperties', 'currentPage']), 2);
});

test('sets page size', test => {
  const state = reducers.GRIDDLE_SET_PAGE_SIZE( new Immutable.Map(), {
    pageSize: 11
  });

  test.is(state.getIn(['pageProperties', 'pageSize']), 11);
});

test('sets filter', test => {
  const state = reducers.GRIDDLE_SET_FILTER(new Immutable.Map(), {
    filter: 'onetwothree'
  });

  test.is(state.get('filter'), 'onetwothree');
});

test('sets sort columns', test => {
  const state = reducers.GRIDDLE_SET_SORT(new Immutable.Map(), {
    sortProperties: [
      { id: 'one', sortAscending: true },
      { id: 'two', sortAscending: false }
    ]
  });

  test.deepEqual(state.get('sortProperties').toJSON(), [
    { id: 'one', sortAscending: true },
    { id: 'two', sortAscending: false }
  ]);
});

test('sets settings visibility', test => {
  const initialState = Immutable.fromJS({
  });

  // should be true when showSettings isn't in state
  const trueState = reducers.GRIDDLE_TOGGLE_SETTINGS(initialState);
  test.is(trueState.get('showSettings'), true);

  const falseState = reducers.GRIDDLE_TOGGLE_SETTINGS(trueState);
  test.is(falseState.get('showSettings'), false);
})

test('toggle column changes column properties visibility', test => {
  const initialState = Immutable.fromJS({
    renderProperties: {
      columnProperties: {
        name: { id: 'name', visible: false }
      }
    }
  });

  const state = reducers.GRIDDLE_TOGGLE_COLUMN(initialState, { columnId: 'name' });
  test.deepEqual(state.getIn(['renderProperties', 'columnProperties', 'name']).toJSON(), { id: 'name', visible: true });
})

test('toggle column sets true when no columnProperty for column but other columnProperties exist', test => {
  const initialState = Immutable.fromJS({
    renderProperties: {
      columnProperties: {
        name: { id: 'name', visible: false }
      }
    }
  });

  const state = reducers.GRIDDLE_TOGGLE_COLUMN(initialState, { columnId: 'state' });
  test.deepEqual(state.getIn(['renderProperties', 'columnProperties', 'state']).toJSON(), { id: 'state', visible: true });
});

test('toggle column works when there is no visible property', (t) => {
  const initialState = Immutable.fromJS({
    renderProperties: {
      columnProperties: {
        name: { id: 'name' }
      }
    }
  });

  // if column isn't in renderProperties->column properties, we should set visible to true
  const state = reducers.GRIDDLE_TOGGLE_COLUMN(initialState, { columnId: 'state' });
  t.deepEqual(state.getIn(['renderProperties', 'columnProperties', 'state']).toJSON(), { id: 'state', visible: true });

  // if column is in reducerProperties but has no visible property should set to false
  const otherState = reducers.GRIDDLE_TOGGLE_COLUMN(initialState, { columnId: 'name' });
  t.deepEqual(otherState.getIn(['renderProperties', 'columnProperties', 'name']).toJSON(), { id: 'name', visible: false });


});
