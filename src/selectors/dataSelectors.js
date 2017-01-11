import Immutable from 'immutable';
import { createSelector } from 'reselect';
import _ from 'lodash';

import MAX_SAFE_INTEGER from 'max-safe-integer'
//import { createSelector } from 'reselect';

/** Gets the full dataset currently tracked by Griddle */
export const dataSelector = state => state.get('data');

/** Gets the page size */
export const pageSizeSelector = state => state.getIn(['pageProperties', 'pageSize']);

/** Gets the current page */
export const currentPageSelector = state => state.getIn(['pageProperties', 'currentPage']);

/** Gets the record count */
export const recordCountSelector = state => state.getIn(['pageProperties', 'recordCount']);

/** Gets the render properties */
export const renderPropertiesSelector = state => (state.get('renderProperties'));

/** Determines if there are previous pages */
export const hasPreviousSelector = createSelector(
  currentPageSelector,
  (currentPage) => (currentPage > 1)
);

/** Gets the max page size
 */
export const maxPageSelector = createSelector(
  pageSizeSelector,
  recordCountSelector,
  (pageSize, recordCount) => {
    const calc = recordCount / pageSize;

    const result =  calc > Math.floor(calc) ? Math.floor(calc) + 1 : Math.floor(calc);

    return _.isFinite(result) ? result : 1;
  }
);

/** Determines if there are more pages available. Assumes pageProperties.maxPage is set by the container */
export const hasNextSelector = createSelector(
  currentPageSelector,
  maxPageSelector,
  (currentPage, maxPage) => {
    console.log(`hasNext current: ${currentPage} max: ${maxPage}`)
    return currentPage < maxPage;
  }
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

/** Gets the column properties objects sorted by order
 */
export const sortedColumnPropertiesSelector = createSelector(
  renderPropertiesSelector,
  (renderProperties) => (
    renderProperties && renderProperties.get('columnProperties') && renderProperties.get('columnProperties').size !== 0 ?
      renderProperties.get('columnProperties')
        .sortBy(col => (col && col.get('order'))||MAX_SAFE_INTEGER) :
      null
  )
);

/** Gets metadata column ids
 */
export const metaDataColumnsSelector = createSelector(
  sortedColumnPropertiesSelector,
  (sortedColumnProperties) => (
    sortedColumnProperties ? sortedColumnProperties
      .filter(c => c.get('isMetadata'))
      .keySeq()
      .toJSON() :
    []
  )
);

/** Gets the visible columns either obtaining the sorted column properties or all columns
 */
export const visibleColumnsSelector = createSelector(
  sortedColumnPropertiesSelector,
  allColumnsSelector,
  (sortedColumnProperties, allColumns) => (
    sortedColumnProperties ? sortedColumnProperties
      .filter(c => {
        const isVisible = c.get('visible') || c.get('visible') === undefined;
        const isMetadata = c.get('isMetadata');
        return isVisible && !isMetadata;
      })
      .keySeq()
      .toJSON() :
    allColumns
  )
);

/** TODO: add tests and docs
 */
export const visibleColumnPropertiesSelector = createSelector(
  visibleColumnsSelector,
  renderPropertiesSelector,
  (visibleColumns=[], renderProperties) => (
    visibleColumns.map(c => {
      const columnProperty = renderProperties.getIn(['columnProperties', c]);
      return (columnProperty && columnProperty.toJSON()) || { id: c }
    })
  )
)

/** Gets the possible columns that are currently hidden */
export const hiddenColumnsSelector = createSelector(
  visibleColumnsSelector,
  allColumnsSelector,
  metaDataColumnsSelector,
  (visibleColumns, allColumns, metaDataColumns) => {
    const removeColumns = [...visibleColumns, ...metaDataColumns];

    return allColumns.filter(c => removeColumns.indexOf(c) === -1);
  }
);

/** TODO: add tests and docs
 */
export const hiddenColumnPropertiesSelector = createSelector(
  hiddenColumnsSelector,
  renderPropertiesSelector,
  (hiddenColumns=[], renderProperties) => (
    hiddenColumns.map(c => {
      const columnProperty = renderProperties.getIn(['columnProperties', c]);

      return (columnProperty && columnProperty.toJSON()) || { id: c }
    })
  )
)

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

export const isSettingsVisibleSelector = (state) => state.get('showSettings');

export const textSelector = (state, { key}) => {
  return state.getIn(['textProperties', key]);
}

/** Gets the column ids for the visible columns
*/
export const columnIdsSelector = createSelector(
  dataSelector,
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
export const columnTitlesSelector = createSelector(
  dataSelector,
  renderPropertiesSelector,
  (visibleData, renderProperties) => {
    if(visibleData.size > 0) {
      return Object.keys(visibleData.get(0).toJSON()).map(k =>
        renderProperties.getIn(['columnProperties', k, 'title']) || k
      )
    }

    return [];
  }
)

/** Gets the griddleIds for the visible rows */
export const visibleRowIdsSelector = createSelector(
  dataSelector,
  (currentPageData) => currentPageData.map(c => c.get('griddleKey'))
);

// TODO: Needs tests and jsdoc
export const cellValueSelector = (state, { griddleKey, columnId }) => {
  return state.get('data')
    .find(r => r.get('griddleKey') === griddleKey)
    .get(columnId);
}

//TODO: Needs tests and jsdoc
export const cellPropertiesSelector = (state, { griddleKey, columnId }) => {
  return state.getIn(['renderProperties', 'columnProperties', columnId]).toJSON();
}