import Immutable from 'immutable';
import initialState from './initial-state';

export function shouldUpdateDrawnRows(action, state) {
  const height = state.getIn(['currentPosition', 'height']);
  const width = state.getIn(['currentPosition', 'width']);

  // If the containers have changed size, update drawn rows.
  if (height != action.yVisible || width != action.xVisible)
    return true;

  const yScrollChangePosition = state.getIn(['currentPosition', 'yScrollChangePosition']);
  const rowHeight = state.getIn(['positionConfig', 'rowHeight']);

  // Get the current visible record count.
  const visibleRecordCount = getVisibleRecordCount(state);

  // Get the count of rendered rows.
  const startDisplayIndex = state.getIn(['currentPosition', 'renderedStartDisplayIndex']);
  const endDisplayIndex = state.getIn(['currentPosition', 'renderedEndDisplayIndex']);
  const renderedRecordCount = endDisplayIndex - startDisplayIndex;

  // Calculate the height of a third of the difference.
  const rowDifferenceHeight = rowHeight * (renderedRecordCount - visibleRecordCount) / 3;

  return Math.abs(action.yScrollPosition - yScrollChangePosition) >= rowDifferenceHeight;
}

export function setCurrentPosition(state, yScrollPosition, xScrollPosition) {
  return state
    .setIn(['currentPosition', 'yScrollChangePosition'], yScrollPosition)
    .setIn(['currentPosition', 'xScrollChangePosition'], xScrollPosition);
}

export function updatePositionProperties(action, state, force) {
  if (!action.force && !shouldUpdateDrawnRows(action, state) && !Immutable.is(state.get('currentPosition'), initialState().get('currentPosition'))) {
    return state; // Indicate that this shouldn't result in an emit.
  }

  const sizeUpdatedState = state.setIn(['currentPosition', 'height'], action.yVisible ?
    action.yVisible * 1.2 :
    state.getIn(['currentPosition', 'height'])
  )
  .setIn(['currentPosition', 'width'], action.xVisible || state.getIn(['currentPosition', 'width']));

  const visibleRecordCount = getVisibleRecordCount(sizeUpdatedState);
  const visibleDataLength = helpers.getDataSetSize(sizeUpdatedState);

  const rowHeight = sizeUpdatedState.getIn(['positionConfig', 'rowHeight']);

  const verticalScrollPosition = action.yScrollPosition || 0;
  const horizontalScrollPosition = action.xScrollPosition || 0;

  // Inspired by : http://jsfiddle.net/vjeux/KbWJ2/9/
  let renderedStartDisplayIndex = Math.max(0, Math.floor(Math.floor(verticalScrollPosition / rowHeight) - visibleRecordCount * 0.25));
  let renderedEndDisplayIndex = Math.min(Math.floor(renderedStartDisplayIndex + visibleRecordCount * 2), visibleDataLength - 1) + 1;

  return setCurrentPosition(sizeUpdatedState, verticalScrollPosition, horizontalScrollPosition)
          .setIn(['currentPosition', 'renderedStartDisplayIndex'], renderedStartDisplayIndex)
          .setIn(['currentPosition', 'renderedEndDisplayIndex'], renderedEndDisplayIndex)
          .setIn(['currentPosition', 'visibleDataLength'], visibleDataLength);
}

export function updateRenderedData(state) {
  const startDisplayIndex = state.getIn(['currentPosition', 'renderedStartDisplayIndex']);
  const columns = helpers.getDataColumns(state, data);
  const data = helpers.getDataSet(state);

  return state
    .set('renderedData', helpers.getVisibleDataColumns(data
      .skip(startDisplayIndex)
      .take(state.getIn(['currentPosition', 'renderedEndDisplayIndex']) - startDisplayIndex), columns));
}
