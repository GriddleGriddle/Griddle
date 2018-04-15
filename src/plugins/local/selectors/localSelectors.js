import Immutable from 'immutable';
import { createSelector } from 'reselect';
import _ from 'lodash';

import { defaultSort } from '../../../utils/sortUtils';
import { getVisibleDataForColumns } from '../../../utils/dataUtils';
import * as dataSelectors from '../../../selectors/dataSelectors';

/** Gets the entire data set
 * @param {Immutable} state - state object
 */
export const dataSelector = state => state.get('data');

export const dataLoadingSelector = dataSelectors.dataLoadingSelector;

/** Gets the current page from pageProperties
 * @param {Immutable} state - state object
 */
export const currentPageSelector = state => state.getIn(['pageProperties', 'currentPage']);

/** Gets the currently set page size
 * @param {Immutable} state - state object
 */
export const pageSizeSelector = state => state.getIn(['pageProperties', 'pageSize']);

/** Gets the currently set filter
 */
export const filterSelector = state => (state.get('filter') || '');

export const sortPropertiesSelector = state => (state.get('sortProperties'));

export const sortMethodSelector = state => state.get('sortMethod');

export const renderPropertiesSelector = state => (state.get('renderProperties'));

export const metaDataColumnsSelector = dataSelectors.metaDataColumnsSelector;

const columnPropertiesSelector = state => state.getIn(['renderProperties', 'columnProperties']);

const substringSearch = (value, filter) => {
  if (!filter) {
    return true;
  }

  const filterToLower = filter.toLowerCase();
  return value && value.toString().toLowerCase().indexOf(filterToLower) > -1;
};

const filterable = (columnProperties, key) => {
  if (key === 'griddleKey') {
    return false;
  }
  if (columnProperties) {
    if (columnProperties.get(key) === undefined ||
      columnProperties.getIn([key, 'filterable']) === false) {
      return false;
    }
  }
  return true;
};

const textFilterRowSearch = (columnProperties, filter) => (row) => {
  return row.keySeq()
    .some((key) => {
      if (!filterable(columnProperties, key)) {
        return false;
      }
      return substringSearch(row.get(key), filter);
    });
};

const objectFilterRowSearch = (columnProperties, filter) => (row, i, data) => {
  return row.keySeq().every((key) => {
    if (!filterable(columnProperties, key)) {
      return true;
    }
    const keyFilter = filter.get(key);
    switch (typeof (keyFilter)) {
      case 'string':
        return substringSearch(row.get(key), keyFilter);
        break;
      case 'function':
        return keyFilter(row.get(key), i, data);
        break;
      default:
        return true;
        break;
    }
  });
};

/** Gets the data filtered by the current filter
 */
export const filteredDataSelector = createSelector(
  dataSelector,
  filterSelector,
  columnPropertiesSelector,
  (data, filter, columnProperties) => {
    if (!filter || !data) {
      return data;
    }

    switch (typeof (filter)) {
      case 'string':
        return data.filter(textFilterRowSearch(columnProperties, filter));
      case 'object':
        return data.filter(objectFilterRowSearch(columnProperties, filter));
      case 'function':
        return data.filter(filter);
      default:
        return data;
    }
  }
);


/** Gets the max page size
 */
export const maxPageSelector = createSelector(
  pageSizeSelector,
  filteredDataSelector,
  (pageSize, data) => {
    const total = data ? data.size : 0;
    const calc = total / pageSize;

    const result = calc > Math.floor(calc) ? Math.floor(calc) + 1 : Math.floor(calc);

    return _.isFinite(result) ? result : 1;
  }
)

export const allColumnsSelector = createSelector(
  dataSelector,
  data => (!data || data.size === 0 ? [] : data.get(0).keySeq().toJSON())
);

/** Gets the column properties objects sorted by order
 */
export const sortedColumnPropertiesSelector = dataSelectors.sortedColumnPropertiesSelector;

/** Gets the visible columns either obtaining the sorted column properties or all columns
 */
export const visibleColumnsSelector = dataSelectors.visibleColumnsSelector;

/** Returns whether or not this result set has more pages
 */
export const hasNextSelector = createSelector(
  currentPageSelector,
  maxPageSelector,
  (currentPage, maxPage) => (currentPage < maxPage)
);

/** Returns whether or not there is a previous page to the current data
 */
export const hasPreviousSelector = state => (state.getIn(['pageProperties', 'currentPage']) > 1);

/** Gets the data sorted by the sort function specified in render properties
 *  if no sort method is supplied, it will use the default sort defined in griddle
 */
export const sortedDataSelector = createSelector(
  filteredDataSelector,
  sortPropertiesSelector,
  renderPropertiesSelector,
  sortMethodSelector,
  (filteredData, sortProperties, renderProperties, sortMethod = defaultSort) => {
    if (!sortProperties) { return filteredData; }

    return sortProperties.reverse().reduce((data, sortColumnOptions) => {
      const columnProperties = renderProperties && renderProperties.get('columnProperties').get(sortColumnOptions.get('id'));

      const sortFunction = (columnProperties && columnProperties.get('sortMethod')) || sortMethod;

      return sortFunction(data, sortColumnOptions.get('id'), sortColumnOptions.get('sortAscending'));
    }, filteredData);
  }
);

/** Gets the current page of data
 */
export const currentPageDataSelector = createSelector(
  sortedDataSelector,
  pageSizeSelector,
  currentPageSelector,
  (sortedData, pageSize, currentPage) => {
    if (!sortedData) {
      return [];
    }

    return sortedData
      .skip(pageSize * (currentPage - 1))
      .take(pageSize);
  }
)

/** Get the visible data (and only the columns that are visible)
 */
export const visibleDataSelector = createSelector(
  currentPageDataSelector,
  visibleColumnsSelector,
  (currentPageData, visibleColumns) => getVisibleDataForColumns(currentPageData, visibleColumns)
);

/** Gets the griddleIds for the visible rows */
export const visibleRowIdsSelector = createSelector(
  currentPageDataSelector,
  currentPageData => (currentPageData ? currentPageData.map(c => c.get('griddleKey')) : new Immutable.List())
);

/** Gets the count of visible rows */
export const visibleRowCountSelector = createSelector(
  visibleRowIdsSelector,
  (visibleRowIds) => visibleRowIds.size
);

/** Gets the columns that are not currently visible
 */
export const hiddenColumnsSelector = createSelector(
  visibleColumnsSelector,
  allColumnsSelector,
  metaDataColumnsSelector,
  (visibleColumns, allColumns, metaDataColumns) => {
    const removeColumns = [...visibleColumns, ...metaDataColumns];

    return allColumns.filter(c => removeColumns.indexOf(c) === -1);
  }
);

/** Gets the column ids for the visible columns
*/
export const columnIdsSelector = createSelector(
  visibleDataSelector,
  renderPropertiesSelector,
  (visibleData, renderProperties) => {
    if (visibleData.size > 0) {
      return Object.keys(visibleData.get(0).toJSON()).map(k =>
        renderProperties.getIn(['columnProperties', k, 'id']) || k
      )
    }
  }
)

/** Gets the column titles for the visible columns
 */
export const columnTitlesSelector = dataSelectors.columnTitlesSelector;
export const cellValueSelector = dataSelectors.cellValueSelector;
export const rowDataSelector = dataSelectors.rowDataSelector;
export const iconsForComponentSelector = dataSelectors.iconsForComponentSelector;
export const iconsByNameSelector = dataSelectors.iconsForComponentSelector;
export const stylesForComponentSelector = dataSelectors.stylesForComponentSelector;
export const classNamesForComponentSelector = dataSelectors.classNamesForComponentSelector;

export const rowPropertiesSelector = dataSelectors.rowPropertiesSelector;
export const cellPropertiesSelector = dataSelectors.cellPropertiesSelector;
export const textSelector = dataSelectors.textSelector;
