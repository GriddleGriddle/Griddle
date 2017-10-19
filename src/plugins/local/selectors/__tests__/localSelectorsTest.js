import test from 'ava';
import Immutable from 'immutable';

//import * as selectors from '../dataSelectors';
import * as selectors from '../localSelectors';
import { composeSelectors } from '../../../../utils/selectorUtils';

test.beforeEach((t) => {
  t.context.selectors = composeSelectors([{selectors}]);
});

test('gets data', test => {
    const state = new Immutable.Map({ data: 'hi' });

    test.deepEqual(test.context.selectors.dataSelector(state), 'hi');
});

test('gets current page', test => {
  const state = new Immutable.fromJS({
    pageProperties: {
      currentPage: 4
    }
  });

  test.is(test.context.selectors.currentPageSelector(state), 4);
});

test('gets current page size', test => {
  const state = new Immutable.fromJS({
    pageProperties: {
      pageSize: 20
    }
  });

  test.is(test.context.selectors.pageSizeSelector(state), 20);
});

test('gets the correct max page', test => {
  const state = new Immutable.fromJS({
    data: [
      { one: 1 },
      { two: 2 },
      { three: 3 },
      { four: 4 },
      { five: 5 },
      { six: 6 },
      { seven: 7 },
      { eight: 8 }
    ],
    pageProperties: {
      pageSize: 3
    }
  });

  // 8/3 = 2.6... so the number of pages should be 3
  test.is(test.context.selectors.maxPageSelector(state), 3);
});

test('gets the correct filter when filter present', test => {
  const state = new Immutable.Map({ filter: 'hi' });

  test.is(test.context.selectors.filterSelector(state), 'hi');
});

test('gets empty string when filter not present', test => {
  const state = new Immutable.Map();

  test.is(test.context.selectors.filterSelector(state), '');
});

test('gets sort properties', test => {
  const state = new Immutable.fromJS({
    sortProperties: [
    { id: 'one', sortAscending: true },
    { id: 'two', sortAscending: false }
    ]
  });

  test.deepEqual(test.context.selectors.sortPropertiesSelector(state).toJSON(), [
    { id: 'one', sortAscending: true },
    { id: 'two', sortAscending: false }
  ]);
});

test('gets render properties', test => {
  const state = new Immutable.fromJS({
    renderProperties: 'hello'
  });

  test.is(test.context.selectors.renderPropertiesSelector(state), 'hello');
});

test('gets all columns', test => {
  const state = new Immutable.fromJS({
    data: [
      { one: 'one', two: 'two', three: 'three' }
    ]
  });

  test.deepEqual(test.context.selectors.allColumnsSelector(state), ['one', 'two', 'three']);
});

test('gets column orders', test => {
  const state = new Immutable.fromJS({
    renderProperties: {
      columnProperties: {
        one: { id: 'one', title: 'One', order: 2 },
        two: { id: 'two', title: 'Two', order: 1 }
      }
    }
  });

  test.deepEqual(test.context.selectors.sortedColumnPropertiesSelector(state).toJSON(), {
    two: { id: 'two', title: 'Two', order: 1 },
    one: { id: 'one', title: 'One', order: 2 }
  });
});

test('gets visible columns when columns specified without order', test => {
  const state = new Immutable.fromJS({
    data: [
      { one: 'hi', two: 'hello', three: 'this should not show up'}
    ],
    renderProperties: {
      columnProperties: {
        one: { id: 'one', title: 'One' },
        two: { id: 'two', title: 'Two' }
      }
    }
  });

  test.deepEqual(test.context.selectors.visibleColumnsSelector(state), ['one', 'two']);
});

test('gets visible columns in order when columns specified', test => {
  const state = new Immutable.fromJS({
    data: [
      { one: 'hi', two: 'hello', three: 'this should not show up'}
    ],
    renderProperties: {
      columnProperties: {
        one: { id: 'one', title: 'One', order: 2 },
        two: { id: 'two', title: 'Two', order: 1 }
      }
    }
  });

  test.deepEqual(test.context.selectors.visibleColumnsSelector(state), ['two', 'one']);
});

test('gets all columns as visible columns when no columns specified', test => {
  const state = new Immutable.fromJS({
    data: [
      { one: 'hi', two: 'hello', three: 'this should not show up'}
    ]
  });

  test.deepEqual(test.context.selectors.visibleColumnsSelector(state), ['one', 'two', 'three']);
});

test('hasNextSelector returns true when more pages', test => {
  const state = new Immutable.fromJS({
    data: [
      { one: 1 },
      { two: 2 },
      { three: 3 },
      { four: 4 },
      { five: 5 },
      { six: 6 },
      { seven: 7 },
      { eight: 8 }
    ],
    pageProperties: {
      currentPage: 1,
      pageSize: 3
    }
  });

  test.is(test.context.selectors.hasNextSelector(state), true);
});

test('hasNextSelector returns false when no more pages', test => {
  const state = new Immutable.fromJS({
     data: [
      { one: 1 },
      { two: 2 },
      { three: 3 },
      { four: 4 },
      { five: 5 },
      { six: 6 },
      { seven: 7 },
      { eight: 8 }
    ],
    pageProperties: {
      currentPage: 1,
      pageSize: 8
    }
  });

  test.is(test.context.selectors.hasNextSelector(state), false);
});

test('hasPreviousSelector returns true when there is a previous page', test => {
  const state = new Immutable.fromJS({
    pageProperties: {
      currentPage: 5
    }
  });

  test.is(test.context.selectors.hasPreviousSelector(state), true);
});

test('hasPreviousSelector returns false when there are no previous pages', test => {
  const state = new Immutable.fromJS({
    pageProperties: {
      currentPage: 1
    }
  });

  test.is(test.context.selectors.hasPreviousSelector(state), false);
});

test('filteredDataSelector returns all data when no filter present', test => {
  const state = new Immutable.fromJS({
    data: [
      { id: '1', name: 'luke skywalker' },
      { id: '2', name: 'han solo' }
    ]
  });

  test.deepEqual(test.context.selectors.filteredDataSelector(state).toJSON(), [
    { id: '1', name: 'luke skywalker' },
    { id: '2', name: 'han solo' }
  ]);
});

test('filteredDataSelector filters data when filter string present', test => {
  const state = new Immutable.fromJS({
    filter: 'luke',
    data: [
      { id: '1', name: 'luke skywalker' },
      { id: '2', name: 'han solo' }
    ]
  });

  test.deepEqual(test.context.selectors.filteredDataSelector(state).toJSON(), [
    { id: '1', name: 'luke skywalker' }
  ]);
});

test('filteredDataSelector filters data respecting filterable', test => {
  const state = new Immutable.fromJS({
    renderProperties: {
      columnProperties: {
        name: {
          filterable: false,
        },
      }
    },
    filter: 'H',
    data: [
      { id: '1', name: 'luke skywalker', weapon: 'light saber' },
      { id: '2', name: 'han solo', weapon: 'blaster' }
    ]
  });

  test.deepEqual(test.context.selectors.filteredDataSelector(state).toJSON(), [
    { id: '1', name: 'luke skywalker', weapon: 'light saber' }
  ]);
});

test('sortedDataSelector uses default sort if no sort method specifed for column', test => {
  const state = new Immutable.fromJS({
    data: [
      { id: '1', name: 'luke skywalker' },
      { id: '2', name: 'han solo' }
    ],
    sortProperties: [
      { id: 'name', sortAscending: true }
    ]
  });

  test.deepEqual(test.context.selectors.sortedDataSelector(state).toJSON(), [
    { id: '2', name: 'han solo' },
    { id: '1', name: 'luke skywalker' }
  ]);
});

test('sortedDataSelector uses specified sort', test => {
  let hasBeenCalled = false;

  const state = new Immutable.fromJS({
    data: [
      { id: '1', name: 'luke skywalker' },
      { id: '2', name: 'han solo' }
    ],
    sortProperties: [
      { id: 'name', sortAscending: true }
    ],
    renderProperties: {
      columnProperties: {
        name: {
          id: 'name', sortMethod: (data, column, sortAscending) => { hasBeenCalled = true; return data }
        }
      }
    }
  });

  test.deepEqual(test.context.selectors.sortedDataSelector(state).toJSON(), [
    { id: '1', name: 'luke skywalker' },
    { id: '2', name: 'han solo' }
  ]);

  test.true(hasBeenCalled)
});

test('sortedDataSelector works with multiple sortOptions', test => {
  const state = new Immutable.fromJS({
    data: [
      { id: '1', name: 'luke skywalker', food: 'orange' },
      { id: '2', name: 'han solo', food: 'banana' },
      { id: '3', name: 'han solo', food: 'apple' },
      { id: '4', name: 'luke skywalker', food: 'apple'}
    ],
    sortProperties: [
      { id: 'name', sortAscending: true },
      { id: 'food', sortAscending: true }
    ]
  });

  test.deepEqual(test.context.selectors.sortedDataSelector(state).toJSON(), [
    { id: '3', name: 'han solo', food: 'apple' },
    { id: '2', name: 'han solo', food: 'banana' },
    { id: '4', name: 'luke skywalker', food: 'apple' },
    { id: '1', name: 'luke skywalker', food: 'orange' }
  ])
});

test('current page data selector gets correct page', test => {
  const state = new Immutable.fromJS({
    data: [
      { id: '1', name: 'luke skywalker', food: 'orange' },
      { id: '2', name: 'han solo', food: 'banana' },
      { id: '3', name: 'han solo', food: 'apple' },
      { id: '4', name: 'luke skywalker', food: 'apple'}
    ],
    pageProperties: {
      currentPage: 3,
      pageSize: 1
    }
  });

  test.deepEqual(test.context.selectors.currentPageDataSelector(state).toJSON(), [{ id: '3', name: 'han solo', food: 'apple' }]);
})

test('visible data selector gets only visible columns', test => {
  const state = new Immutable.fromJS({
    data: [
      { id: '1', name: 'luke skywalker', food: 'orange' },
      { id: '2', name: 'han solo', food: 'banana' },
      { id: '3', name: 'han solo', food: 'apple' },
      { id: '4', name: 'luke skywalker', food: 'apple'}
    ],
    renderProperties: {
      columnProperties: {
        name: {
          id: 'name'
        },
        food: {
          id: 'food'
        }
      }
    },
    pageProperties: {
      currentPage: 3,
      pageSize: 1
    }
  });

  test.deepEqual(test.context.selectors.visibleDataSelector(state).toJSON(), [{ name: 'han solo', food: 'apple' }]);
});

test('visibleRowIdsSelector gets row ids', test => {
  const state = new Immutable.fromJS({
    data: [
      { id: '1', name: 'luke skywalker', food: 'orange', griddleKey: 1 },
      { id: '2', name: 'han solo', food: 'banana', griddleKey: 2 },
      { id: '3', name: 'han solo', food: 'apple', griddleKey: 3 },
      { id: '4', name: 'luke skywalker', food: 'apple', griddleKey: 4}
    ],
    renderProperties: {
      columnProperties: {
        name: {
          id: 'name'
        }
      }
    },
    pageProperties: {
      currentPage: 2,
      pageSize: 2
    }
  });

  test.deepEqual(test.context.selectors.visibleRowIdsSelector(state).toJSON(), [3, 4]);
});

test('hidden columns selector shows all columns that are not visible', test => {
  const state = new Immutable.fromJS({
    data: [
      { id: '1', name: 'luke skywalker', food: 'orange' },
      { id: '2', name: 'han solo', food: 'banana' },
      { id: '3', name: 'han solo', food: 'apple' },
      { id: '4', name: 'luke skywalker', food: 'apple'}
    ],
    renderProperties: {
      columnProperties: {
        name: {
          id: 'name'
        }
      }
    },
    pageProperties: {
      currentPage: 3,
      pageSize: 1
    }
  });

  test.deepEqual(test.context.selectors.hiddenColumnsSelector(state), ['id', 'food']);
});

test('columnIdsSelector gets all column ids', test => {
    const state = new Immutable.fromJS({
    data: [
      { id: '1', name: 'luke skywalker', food: 'orange' },
      { id: '2', name: 'han solo', food: 'banana' },
      { id: '3', name: 'han solo', food: 'apple' },
      { id: '4', name: 'luke skywalker', food: 'apple'}
    ],
    renderProperties: {
      columnProperties: {
        name: {
          id: 'first',
          title: 'Name'
        },
        id: {
          id: 'second',
          title: 'ID'
        },
        food: {
          id: 'third',
          title: 'Food Order'
        }
      }
    },
    pageProperties: {
      currentPage: 3,
      pageSize: 1
    }
  });

  test.deepEqual(test.context.selectors.columnIdsSelector(state), ['first', 'second', 'third']);
});

test('columnTitlesSelector gets all column titles', test => {
  const state = new Immutable.fromJS({
    data: [
      { id: '1', name: 'luke skywalker', food: 'orange' },
      { id: '2', name: 'han solo', food: 'banana' },
      { id: '3', name: 'han solo', food: 'apple' },
      { id: '4', name: 'luke skywalker', food: 'apple'}
    ],
    renderProperties: {
      columnProperties: {
        name: {
          id: 'name',
          title: 'Name'
        },
        id: {
          id: 'id',
          title: 'ID'
        },
        food: {
          id: 'food',
          title: 'Food Order'
        }
      }
    },
    pageProperties: {
      currentPage: 3,
      pageSize: 1
    }
  });

  test.deepEqual(test.context.selectors.columnTitlesSelector(state), ['Name', 'ID', 'Food Order']);
});
