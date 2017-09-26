import Immutable from 'immutable';
import { createSelector } from 'reselect';
import _ from 'lodash';
import MAX_SAFE_INTEGER from 'max-safe-integer'

export const hasPreviousSelector = {
  creator: ({currentPageSelector}) => {
    return createSelector(
      currentPageSelector,
      (currentPage) => (currentPage > 1)
    );
  },
  dependencies: ["currentPageSelector"]
};

export const maxPageSelector = {
  creator: ({pageSizeSelector, recordCountSelector}) => {
    return createSelector(
      pageSizeSelector,
      recordCountSelector,
      (pageSize, recordCount) => {
        const calc = recordCount / pageSize;
        const result =  calc > Math.floor(calc) ? Math.floor(calc) + 1 : Math.floor(calc);
        return _.isFinite(result) ? result : 1;
      }
    );
  },
  dependencies: ["pageSizeSelector", "recordCountSelector"]
};

export const hasNextSelector = { 
  creator: ({currentPageSelector, maxPageSelector}) => {
    return createSelector(
      currentPageSelector,
      maxPageSelector,
      (currentPage, maxPage) => {
        return currentPage < maxPage;
      }
    );
  },
  dependencies: ["currentPageSelector", "maxPageSelector"]
};

export const allColumnsSelector = {
  creator: ({dataSelector, renderPropertiesSelector}) => {
    return createSelector(
      dataSelector,
      renderPropertiesSelector,
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
  },
  dependencies: ["dataSelector", "renderPropertiesSelector"]
};

export const sortedColumnPropertiesSelector = {
  creator: ({renderPropertiesSelector}) => {
    return createSelector(
      renderPropertiesSelector,
      (renderProperties) => (
        renderProperties && renderProperties.get('columnProperties') && renderProperties.get('columnProperties').size !== 0 ?
        renderProperties.get('columnProperties')
        .sortBy(col => (col && col.get('order'))||MAX_SAFE_INTEGER) :
        null
      )
    );
  },
  dependencies: ["renderPropertiesSelector"]
};

export const metaDataColumnsSelector = {
  creator: ({sortedColumnPropertiesSelector}) => {
    return createSelector(
      sortedColumnPropertiesSelector,
      (sortedColumnProperties) => (
        sortedColumnProperties ? sortedColumnProperties
        .filter(c => c.get('isMetadata'))
        .keySeq()
        .toJSON() :
        []
      )
    );
  },
  dependencies: ["sortedColumnPropertiesSelector"]
};


export const visibleColumnsSelector = {
  creator: ({sortedColumnPropertiesSelector, allColumnsSelector}) => {
    return createSelector(
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
  },
  dependencies: ["sortedColumnPropertiesSelector", "allColumnsSelector"]
};

export const visibleColumnPropertiesSelector = {
  creator: ({visibleColumnsSelector, renderPropertiesSelector}) => {
    return createSelector(
      visibleColumnsSelector,
      renderPropertiesSelector,
      (visibleColumns=[], renderProperties) => (
        visibleColumns.map(c => {
          const columnProperty = renderProperties.getIn(['columnProperties', c]);
          return (columnProperty && columnProperty.toJSON()) || { id: c }
        })
      )
    );
  },
  dependencies: ["visibleColumnsSelector", "renderPropertiesSelector"]
};

export const hiddenColumnsSelector = {
  creator: ({visibleColumnsSelector, allColumnsSelector, metaDataColumnsSelector}) => {
    return createSelector(
      visibleColumnsSelector,
      allColumnsSelector,
      metaDataColumnsSelector,
      (visibleColumns, allColumns, metaDataColumns) => {
        const removeColumns = [...visibleColumns, ...metaDataColumns];

        return allColumns.filter(c => removeColumns.indexOf(c) === -1);
      }
    );
  },
  dependencies: ["visibleColumnsSelector", "allColumnsSelector", "metaDataColumnsSelector"]
};

export const hiddenColumnPropertiesSelector = {
  creator: ({hiddenColumnsSelector, renderPropertiesSelector}) => {
    return createSelector(
      hiddenColumnsSelector,
      renderPropertiesSelector,
      (hiddenColumns=[], renderProperties) => (
        hiddenColumns.map(c => {
          const columnProperty = renderProperties.getIn(['columnProperties', c]);

          return (columnProperty && columnProperty.toJSON()) || { id: c }
        })
      )
    );
  },
  dependencies: ["hiddenColumnsSelector", "renderPropertiesSelector"]
};

export const columnIdsSelector = {
  creator: ({renderPropertiesSelector, visibleColumnsSelector}) => {
    return createSelector(
      renderPropertiesSelector,
      visibleColumnsSelector,
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
  },
  dependencies: ["renderPropertiesSelector", "visibleColumnsSelector"]
};

export const columnTitlesSelector = {
  creator: ({columnIdsSelector, renderPropertiesSelector}) => {
    return createSelector(
      columnIdsSelector,
      renderPropertiesSelector,
      (columnIds, renderProperties) => columnIds.map(k => renderProperties.getIn(['columnProperties', k, 'title']) || k)
    );
  },
  dependencies: ["columnIdsSelector", "renderPropertiesSelector"]
};

export const visibleRowIdsSelector = {
  creator: ({dataSelector}) => {
    return createSelector(
      dataSelector,
      currentPageData => currentPageData ? currentPageData.map(c => c.get('griddleKey')) : new Immutable.List()
    );
  },
  dependencies: ["dataSelector"]
};

export const visibleRowCountSelector = {
  creator: ({visibleRowIdsSelector}) => {
    return createSelector(
      visibleRowIdsSelector,
      (visibleRowIds) => visibleRowIds.size
    );
  },
  dependencies: ["visibleRowIdsSelector"]
};
