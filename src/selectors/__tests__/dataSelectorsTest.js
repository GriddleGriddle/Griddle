import test from 'ava';
import Immutable from 'immutable';

import * as selectors from '../dataSelectors';

test('gets data', test => {
  const state = new Immutable.Map().set('data', 'hi');
  test.is(selectors.dataSelector(state), 'hi');
});

test('gets pageSize', test => {
  const state = new Immutable.Map().setIn(['pageProperties', 'pageSize'], 7);
  test.is(selectors.pageSizeSelector(state), 7);
});

/* currentPageSelector */
test('gets current page', test => {
  const state = new Immutable.Map().setIn(['pageProperties', 'currentPage'], 3);
  test.is(selectors.currentPageSelector(state), 3);
});

/* recordCountSelector */
test('gets record count', test => {
  const state = new Immutable.Map().setIn(['pageProperties', 'recordCount'], 10);
  test.is(selectors.recordCountSelector(state), 10);
});

/* hasNextSelector */
test('hasNext gets true when there are more pages', test => {
  const state = Immutable.fromJS({
    pageProperties: {
      recordCount: 20,
      pageSize: 7,
      currentPage: 2
    }
  });

  test.true(selectors.hasNextSelector(state));
});

test('hasNext gets false when there are not more pages', test => {
  const state = Immutable.fromJS({
    pageProperties: {
      recordCount: 20,
      pageSize: 11,
      currentPage: 2
    }
  });

  test.false(selectors.hasNextSelector(state));
});

/* this is just double checking that we're not showing next when on record 11-20 of 20 */
test('hasNext gets false when on the last page', test => {
  const state = Immutable.fromJS({
    pageProperties: {
      recordCount: 20,
      pageSize: 10,
      currentPage: 2
    }
  });

  test.false(selectors.hasNextSelector(state));
});

/* hasPreviousSelector */
test('has previous gets true when there are prior pages', test => {
  const state = new Immutable.Map().setIn(['pageProperties', 'currentPage'], 2);
  test.true(selectors.hasPreviousSelector(state));
});

test.skip('has previous gets false when there are not prior pages', test => {
  const state = new Immutable.Map().setIn(['pageProperties', 'currentPage'], 2);
  test.true(selectors.hasPreviousSelector(state));
})

/* currentPageSelector */
test('gets current page', test => {
  const state = new Immutable.Map().setIn(['pageProperties', 'currentPage'], 1);
  test.false(selectors.hasPreviousSelector(state));
})

/* maxPageSelector */
test('gets max page', test => {
  const state = Immutable.fromJS({
    pageProperties: {
      recordCount: 20,
      pageSize: 10,
      currentPage: 2
    }
  });

  test.is(selectors.maxPageSelector(state), 2);

  //ensure that we get 2 pages when full pageSize would not be displayed on next page
  const otherState = state.setIn(['pageProperties', 'pageSize'], 11);
  test.is(selectors.maxPageSelector(otherState), 2);

  //when pageSize === recordCount should have 1 page
  const onePageState = state.setIn(['pageProperties', 'pageSize'], 20);
  test.is(selectors.maxPageSelector(onePageState), 1);

  //when there are no records, there should be 0 pages
  const noDataState = state.setIn(['pageProperties', 'recordCount'], 0);
  test.is(selectors.maxPageSelector(noDataState), 0);
});

/* filterSelector */
test('gets filter when present', test => {
  const state = new Immutable.Map().set('filter', 'some awesome filter');
  test.is(selectors.filterSelector(state), 'some awesome filter');
})

test('gets empty string when no filter present', test => {
  const state = new Immutable.Map();
  test.is(selectors.filterSelector(state), '');
});

/* sortColumnsSelector */
test('gets empty array for sortColumns when none specified', test => {
  const state = new Immutable.Map();
  test.deepEqual(selectors.sortColumnsSelector(state), []);
});

test('gets sort column array when specified', test => {
  const state = new Immutable.Map()
    .set('sortColumns', [
      { column: 'one', sortAscending: true},
      { column: 'two', sortAscending: true},
      { column: 'three', sortAscending: true}
    ]);

  test.deepEqual(selectors.sortColumnsSelector(state), [
    { column: 'one', sortAscending: true},
    { column: 'two', sortAscending: true},
    { column: 'three', sortAscending: true}
  ]);
})

/* allColumnsSelector */
test('allColumnsSelector: gets all columns', test => {
  const data = Immutable.fromJS([
    { one: 'one', two: 'two', three: 'three', four: 'four' }
  ]);

  const state = new Immutable.Map().set('data', data);

  test.deepEqual(selectors.allColumnsSelector(state), ['one', 'two', 'three', 'four']);
});

test('allColumnsSelector: gets empty array when no data present', test => {
  const state = new Immutable.Map();

  test.deepEqual(selectors.allColumnsSelector(state), []);
});

test('allColumnsSelector: gets empty array when data is empty', test => {
  const state = new Immutable.Map().set('data', new Immutable.List());
  test.deepEqual(selectors.allColumnsSelector(state), []);
});

test('allColumnsSelector accounts for made up columns', test => {
  // this is to catch the case where someone has a column that they added through column
  // definitions and something that's not in the data
  const state = new Immutable.fromJS({
    data: [
      { one: 'one', two: 'two', three: 'three'}
    ],
    renderProperties: {
      columnProperties: {
        something: { id: 'one', title: 'One' },
      }
    }
  });

  test.deepEqual(selectors.allColumnsSelector(state), ['one', 'two', 'three', 'something']);
});

test('iconByNameSelector gets given icon', test => {
  const state = new Immutable.fromJS({
    styleConfig: {
      icons: {
        one: 'yo'
      }
    }
  });

  test.is(selectors.iconByNameSelector(state, {name: 'one'}), 'yo');
});

test('iconByNameSelector gets undefined when icon not present in collection', test => {
  const state = new Immutable.fromJS({
    styles: {
      icons: {
        one: 'yo'
      }
    }
  });

  test.is(selectors.iconByNameSelector(state, { name: 'two'}), undefined)
});

test('classNamesForComponentSelector gets given class', test => {
  const state = new Immutable.fromJS({
    styleConfig: {
      classNames: {
        one: 'yo'
      }
    }
  });

  test.is(selectors.classNamesForComponentSelector(state, 'one'), 'yo');
});

test('classNameForComponentSelector gets undefined when icon not present in collection', test => {
  const state = new Immutable.fromJS({
    styleConfig: {
      classNames: {
        one: 'yo'
      }
    }
  });

  test.is(selectors.classNamesForComponentSelector(state, 'two'), undefined);
});

test('isSettingsEnabled returns true when not set', test => {
  const state = new Immutable.fromJS({});

  test.is(selectors.isSettingsEnabledSelector(state), true);
});

test('isSettingsEnabled returns the value that was set', test => {
  const enabledState = new Immutable.fromJS({ enableSettings: true });
  const disabledState = new Immutable.fromJS({ enableSettings: false });

  test.is(selectors.isSettingsEnabledSelector(enabledState), true);
  test.is(selectors.isSettingsEnabledSelector(disabledState), false);
});

test('gets text from state', test => {
  const state = new Immutable.fromJS({
    textProperties: {
      one: 'one two three'
    }
  });

  test.is(selectors.textSelector(state, { key: 'one'}), 'one two three');
});

test('gets metadata columns', test => {
  const state = new Immutable.fromJS({
    data: [
      { one: 'hi', two: 'hello', three: 'this should not show up'}
    ],
    renderProperties: {
      columnProperties: {
        one: { id: 'one', title: 'One' },
        two: { id: 'two', title: 'Two', isMetadata: true }
      }
    }
  });

  test.deepEqual(selectors.metaDataColumnsSelector(state), ['two']);
});

test('it gets columnTitles in the correct order', test => {
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

  test.deepEqual(selectors.columnTitlesSelector(state), ['Two', 'One']);
});

[undefined, null].map(data =>
  test(`visibleRowIds is empty if data is ${data}`, (assert) => {
    const state = new Immutable.fromJS({
      data
    });

    assert.deepEqual(selectors.visibleRowIdsSelector(state), new Immutable.List());
  })
);

test('visibleRowIds gets griddleKey from data', (assert) => {
  const state = new Immutable.fromJS({
    data: [
      { griddleKey: 2 },
      { griddleKey: 4 },
      { griddleKey: 6 },
    ],
  });

  assert.deepEqual(selectors.visibleRowIdsSelector(state), new Immutable.List([2, 4, 6]));
});

test('rowDataSelector gets row data', (assert) => {
  const state = new Immutable.fromJS({
    data: [
      { griddleKey: 2, id: 2 },
      { griddleKey: 6, id: 1 },
    ],
    lookup: {
      "2": 0,
      "6": 1,
    },
  });

  assert.deepEqual(selectors.rowDataSelector(state, { griddleKey: 6 }), { griddleKey: 6, id: 1 });
});
