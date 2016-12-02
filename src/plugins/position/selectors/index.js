import { createSelector } from 'reselect';

import { sortedDataSelector, visibleColumnsSelector } from '../../../selectors/dataSelectors';

export const positionSettingsSelector = state => state.get('positionSettings');


// From what i can tell from the original virtual scrolling plugin...
// 1. We want to get the visible record count
// 2. Get the size of the dataset we're working with (whether thats local or remote)
// 3. Figure out the renderedStart and End display index
// 4. Show only the records that'd fall in the render indexes

/** Gets the number of viisble rows based on the height of the container and the rowHeight
 */
export const visibleRecordCountSelector = createSelector(
  positionSettingsSelector,
  (positionSettings) => {
    const rowHeight = positionSettings.get('rowHeight');
    const height = positionSettings.get('height');

    return Math.ceil(height / rowHeight);
  }
);

export const visibleDataLengthSelector = createSelector(
  sortedDataSelector,
  (sortedData) => {
    return sortedData.length;
  }
);

const rowHeightSelector = state => state.getIn(['positionConfig', 'rowHeight']);

const hoizontalScrollChangeSelector = state => state.getIn(['currentPosition', 'xScrollChangePosition']) || 0;
const verticalScrollChangeSelector = state => state.getIn(['currentPosition', 'yScrollChangePosition']) || 0;

const startIndexSelector = createSelector(
  verticalScrollChangeSelector,
  rowHeightSelector,
  visibleRecordCountSelector,
  (verticalScrollPosition, rowHeight, visibleRecordCount) => {
    // Inspired by : http://jsfiddle.net/vjeux/KbWJ2/9/
    return Math.max(0, Math.floor(Math.floor(verticalScrollPosition / rowHeight) - visibleRecordCount * 0.25));
  }
);

const endIndexSelector = createSelector(
  startIndexSelector,
  visibleRecordCountSelector,
  visibleDataLengthSelector,
  (renderedStartDisplayIndex, rowHeight, visibleDataLengthSelector) => {
    // Inspired by : http://jsfiddle.net/vjeux/KbWJ2/9/
    return Math.min(Math.floor(renderedStartDisplayIndex + visibleRecordCount * 2), visibleDataLength - 1) + 1;
  }
);

const rawDataSelector = state => state.get('data');

/** Gets the current page of data
 * Won't be memoized :cry:
 */
export const currentPageDataSelector = (...args) => {
  return createSelector(
    sortedDataSelector,
    startIndexSelector,
    endIndexSelector,
    (sortedData, startDisplayIndex, endDisplayIndex) => {
        return sortedDataSelector
                .skip(startDisplayIndex)
                .take(endDisplayIndex - startDisplayIndex);
    }
  )(...args);
};

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
