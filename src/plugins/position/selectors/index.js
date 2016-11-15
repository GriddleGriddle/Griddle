import { createSelector } from 'reselect';

import * as dataSelectors from '../../../selectors/dataSelectors';

export const positionSettingsSelector = state => state.get('positionSettings');

export const visibleRecordCountSelector = createSelector(
  positionSettingsSelector,
  (positionSettings) => {
    const rowHeight = positionSettings.get('rowHeight');
    const height = positionSettings.get('currentHeight');

    return Math.ceil(height / rowHeight);
  }
);
