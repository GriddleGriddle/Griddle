import Immutable from 'immutable';
import { createSelector } from 'reselect';

//import MAX_SAFE_INTEGER from 'max-save-integer';
//import { createSelector } from 'reselect';

/** Gets the full dataset currently tracked by Griddle */
export const dataSelector = state => state.get('data');

/** Gets the page size */
export const pageSizeSelector = state => state.getIn(['pageProperties', 'pageSize']);

/** Gets the current page */
export const currentPageSelector = state => state.getIn(['pageProperties', 'currentPage']);

/** Gets the record count */
export const recordCountSelector = state => state.getIn(['pageProperties', 'recordCount']);

/** Determines if there are more pages available. Assumes pageProperties.maxPage is set by the container */
export const hasNextSelector = createSelector(
  currentPageSelector,
  pageSizeSelector,
  recordCountSelector,
  (currentPage, pageSize, recordCount) => {
    return (currentPage * pageSize) < recordCount;
  }
);

/** Determines if there are previous pages */
export const hasPreviousSelector = createSelector(
  currentPageSelector,
  (currentPage) => (currentPage > 1)
);

/** Determines the maxPageCount based on pageSize / recordCount */
export const maxPageCountSelector = createSelector(
  pageSizeSelector,
  recordCountSelector,
  (pageSize, recordCount) => (Math.ceil(recordCount / pageSize))
);

/** Gets current filter */
export const filterSelector = state => state.get('filter') || '';
