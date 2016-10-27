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

/** Gets the current sortColumns */
export const sortColumnsSelector = state => state.get('sortColumns') || [];

/** Gets all the columns */
export const allColumnsSelector = createSelector(
  dataSelector,
  (data) => (
    !data || data.size === 0 ?
      [] :
      data.get(0).keySeq().toJSON()
  )
);

/** Gets the sort property for a given column */
export const sortPropertyByIdSelector = (state, { columnId }) => {
  const sortProperties = state.get('sortProperties');
  const individualProperty = sortProperties && sortProperties.size > 0 && sortProperties.find(r => r.get('id') === columnId);

  return (individualProperty && individualProperty.toJSON()) || null;
}

/** Gets the icons property from styles */
export const iconByNameSelector = (state, { name }) => {
  return state.getIn(['styles', 'icons', name]);
}

/** Gets a classname from the styles object */
export const classNameByNameSelector = (state, { name}) => {
  return state.getIn(['styles', 'classNames', name]);
}

/** Gets a custom component for a given column
* TODO: Needs tests
*/
export const customComponentSelector = (state, { columnId }) => {
  return state.getIn(['renderProperties', 'columnProperties', columnId, 'customComponent']);
}

/** Gets a custom heading component for a given column
* TODO: Needs tests
*/
export const customHeadingComponentSelector = (state, { columnId}) => {
  return state.getIn(['renderProperties', 'columnProperties', columnId, 'customHeadingComponent']);
}

export const isSettingsEnabledSelector = (state) => {
  const enableSettings = state.get('enableSettings');

  return enableSettings === undefined ? true : enableSettings;
}

export const textSelector = (state, { key}) => {
  return state.getIn(['textProperties', key]);
}
