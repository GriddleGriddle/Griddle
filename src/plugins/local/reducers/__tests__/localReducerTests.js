import test from 'ava';
import Immutable from 'immutable';

import * as reducers from '../index';
import constants from '../../../../constants';

test('it loads data', test => {
  const state = reducers.GRIDDLE_LOADED_DATA(new Immutable.Map(), {
    data: [
      {name: "one"},
      {name: "two"}
    ]}
  );

  test.deepEqual(state.toJSON(), {
    data: [
      {name: "one", griddleKey: 0},
      {name: "two", griddleKey: 1}
    ],
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
    filter: 'onetwothree',
  });

  test.is(state.get('filter'), 'onetwothree');
  test.is(state.getIn(['pageProperties', 'currentPage']), 1)
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
/*
  describe('sorting', () => {
    const reducer = (options, method) => {
      return getMethod(extend(options, { method }));
    }

    it('sets sort column', () => {
      const state = reducer({payload: { sortColumns: ['one']}}, GRIDDLE_SORT);

      expect(state.get('sortColumns')).toEqual(['one']);
    });
  });
});

*/
