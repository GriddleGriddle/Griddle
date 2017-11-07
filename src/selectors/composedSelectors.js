import Immutable from 'immutable';
import { createSelector } from 'reselect';
import _ from 'lodash';
import MAX_SAFE_INTEGER from 'max-safe-integer'
import { griddleCreateSelector } from '../utils/selectorUtils';

export const dataLoadingSelector = griddleCreateSelector(
  "dataSelector",
  data => !data
);

export const hasPreviousSelector = griddleCreateSelector(
  "currentPageSelector",
  (currentPage) => (currentPage > 1)
);

export const maxPageSelector = griddleCreateSelector(
  "pageSizeSelector", 
  "recordCountSelector",
  (pageSize, recordCount) => {
    const calc = recordCount / pageSize;
    const result =  calc > Math.floor(calc) ? Math.floor(calc) + 1 : Math.floor(calc);
    return _.isFinite(result) ? result : 1;
  }
);

export const hasNextSelector = griddleCreateSelector(
  "currentPageSelector",
  "maxPageSelector",
  (currentPage, maxPage) => {
    return currentPage < maxPage;
  }
);

export const allColumnsSelector = griddleCreateSelector(
  "dataSelector",
  "renderPropertiesSelector",
  (data, renderProperties) => {
    const dataColumns = !data || data.size === 0 ?
      [] :
      data.get(0).keySeq().toJSON();

    const columnPropertyColumns = (renderProperties && renderProperties.size > 0) ?
      // TODO: Make this not so ugly
      Object.keys(renderProperties.get('columnProperties').toJSON()) :
      [];

    return _.union(dataColumns, columnPropertyColumns);
  }
);

export const sortedColumnPropertiesSelector = griddleCreateSelector(
  "renderPropertiesSelector",
  (renderProperties) => (
    renderProperties && renderProperties.get('columnProperties') && renderProperties.get('columnProperties').size !== 0 ?
    renderProperties.get('columnProperties')
    .sortBy(col => (col && col.get('order'))||MAX_SAFE_INTEGER) :
    null
  )
);

export const metaDataColumnsSelector = griddleCreateSelector(
  "sortedColumnPropertiesSelector",
  (sortedColumnProperties) => (
    sortedColumnProperties ? sortedColumnProperties
    .filter(c => c.get('isMetadata'))
    .keySeq()
    .toJSON() :
    []
  )
);

export const visibleColumnsSelector = griddleCreateSelector(
  "sortedColumnPropertiesSelector",
  "allColumnsSelector",
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

export const visibleColumnPropertiesSelector = griddleCreateSelector(
  "visibleColumnsSelector",
  "renderPropertiesSelector",
(visibleColumns=[], renderProperties) => (
        visibleColumns.map(c => {
          const columnProperty = renderProperties.getIn(['columnProperties', c]);
          return (columnProperty && columnProperty.toJSON()) || { id: c }
        })
      )
);

export const hiddenColumnsSelector = griddleCreateSelector(
  "visibleColumnsSelector", 
  "allColumnsSelector", 
  "metaDataColumnsSelector",
(visibleColumns, allColumns, metaDataColumns) => {
        const removeColumns = [...visibleColumns, ...metaDataColumns];

        return allColumns.filter(c => removeColumns.indexOf(c) === -1);
      }
);

export const hiddenColumnPropertiesSelector = griddleCreateSelector(
  "hiddenColumnsSelector", 
  "renderPropertiesSelector",
(hiddenColumns=[], renderProperties) => (
        hiddenColumns.map(c => {
          const columnProperty = renderProperties.getIn(['columnProperties', c]);

          return (columnProperty && columnProperty.toJSON()) || { id: c }
        })
      )
);

export const columnIdsSelector = griddleCreateSelector(
  "renderPropertiesSelector", 
  "visibleColumnsSelector",
(renderProperties, visibleColumns) => {
        const offset = 1000;
        // TODO: Make this better -- This is pretty inefficient
        return visibleColumns
          .map((k, index) => ({
            id: renderProperties.getIn(['columnProperties', k, 'id']) || k,
            order: renderProperties.getIn(['columnProperties', k, 'order']) || offset + index
          }))
          .sort((first, second) => first.order - second.order)
          .map(item => item.id);
      }
);

export const columnTitlesSelector = griddleCreateSelector(
  "columnIdsSelector",
  "renderPropertiesSelector",
  (columnIds, renderProperties) => columnIds.map(k => renderProperties.getIn(['columnProperties', k, 'title']) || k)
);

export const visibleRowIdsSelector = griddleCreateSelector(
  "dataSelector",
  currentPageData => currentPageData ? currentPageData.map(c => c.get('griddleKey')) : new Immutable.List()
);

export const visibleRowCountSelector = griddleCreateSelector(
  "visibleRowIdsSelector",
  (visibleRowIds) => visibleRowIds.size
);
