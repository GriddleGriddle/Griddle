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
})

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
test.skip('gets filter when present', test => {

})

test.skip('gets empty string when no filter present', test => {

})

/* filteredDataSelector */
test.skip('gets a filtered subset of the data when filter present', test => {

})

test.skip('gets the entire dataset when no filter present', test => {

})
