import { createSelector } from 'reselect';

import * as dataSelectors from '../../../selectors/dataSelectors';

export const positionSettingsSelector = state => state.get('positionSettings');

export const getRenderedDataSelector = state => state.get('renderedData');

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

// From what i can tell from the original virtual scrolling plugin...
// 1. We want to get the visible record count
// 2. Get the size of the dataset we're working with (whether thats local or remote)
// 3. Figure out the renderedStart and End display index
// 4. Show only the records that'd fall in the render indexes
