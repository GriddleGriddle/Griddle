import Immutable from 'immutable';
import { createSelector } from 'reselect';
import MAX_SAFE_INTEGER from 'max-safe-integer'

import { defaultSort } from '../../../utils/sortUtils';
import { getVisibleDataForColumns } from '../../../utils/dataUtils';
import * as dataSelectors from '../../../selectors/dataSelectors';

/** Gets the entire data set
 * @param {Immutable} state - state object
 */
export const dataSelector = state => state.get('data');

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

export const renderPropertiesSelector = state => (state.get('renderProperties'));

export const metaDataColumnsSelector = dataSelectors.metaDataColumnsSelector;

/** Gets the data filtered by the current filter
 */
export const filteredDataSelector = createSelector(
  dataSelector,
  filterSelector,
  (data, filter) => {
    return data.filter(row  => {
      return Object.keys(row.toJSON())
        .some(key => {
          return row.get(key) && row.get(key).toString().toLowerCase().indexOf(filter.toLowerCase()) > -1
        })
      })
  }
);


/** Gets the max page size
 */
export const maxPageSelector = createSelector(
  pageSizeSelector,
  filteredDataSelector,
  (pageSize, data) => {
    const total = data.size;
    const calc = total / pageSize;

    return calc > Math.floor(calc) ? Math.floor(calc) + 1 : Math.floor(calc);
  }
)

export const allColumnsSelector = createSelector(
  dataSelector,
  (data) => (data.size === 0 ? [] : data.get(0).keySeq().toJSON())
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
  (filteredData, sortProperties, renderProperties) => {
    if (!sortProperties) { return filteredData; }

    return sortProperties.reverse().reduce((data, sortColumnOptions) => {
      const columnProperties = renderProperties && renderProperties.get('columnProperties').get(sortColumnOptions.get('id'));

      const sortFunction = (columnProperties && columnProperties.get('sortMethod')) || defaultSort;

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
  (currentPageData) => currentPageData.map(c => c.get('griddleKey'))
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
    if(visibleData.size > 0) {
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
