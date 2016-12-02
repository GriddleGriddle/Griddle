import { setCurrentPosition, updatePositionProperties } from '../utils';

export function XY_POSITION_CHANGED(state, action) {
  const height = state.getIn(['positionSettings', 'height']) || 0;
  const width = state.getIn(['positionSettings', 'width']) || 0;

  return state
    .setIn(['positionSettings', 'xScrollPosition'], action.xScrollPosition || 0)
    .setIn(['positionSettings', 'yScrollPosition'], action.yScrollPosition || 0)
    .setIn(['positionSettings', 'height'], action.height || height)
    .setIn(['positionSettings', 'width'], action.width || width);
}

export function GRIDDLE_SET_FILTER_AFTER(state, action, helpers) {
  return state.setIn(['positionSettings', 'xScrollChangePosition'], 0)
              .setIn(['positionSettings', 'yScrollChangePosition'], 0);
}
