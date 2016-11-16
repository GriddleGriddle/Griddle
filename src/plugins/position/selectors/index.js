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
