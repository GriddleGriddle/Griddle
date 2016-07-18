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

  test.is(selectors.maxPageCountSelector(state), 2);

  //ensure that we get 2 pages when full pageSize would not be displayed on next page
  const otherState = state.setIn(['pageProperties', 'pageSize'], 11);
  test.is(selectors.maxPageCountSelector(otherState), 2);

  //when pageSize === recordCount should have 1 page
  const onePageState = state.setIn(['pageProperties', 'pageSize'], 20);
  test.is(selectors.maxPageCountSelector(onePageState), 1);

  //when there are no records, there should be 0 pages
  const noDataState = state.setIn(['pageProperties', 'recordCount'], 0);
  test.is(selectors.maxPageCountSelector(noDataState), 0);
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
