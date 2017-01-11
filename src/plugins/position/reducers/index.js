import { setCurrentPosition, updatePositionProperties } from '../utils';

export function XY_POSITION_CHANGED(state, action) {
  const height = state.getIn(['currentPosition', 'height']) || 0;
  const width = state.getIn(['currentPosition', 'width']) || 0;

  return state
    .setIn(['currentPosition', 'xScrollChangePosition'], action.xScrollPosition || 0)
    .setIn(['currentPosition', 'yScrollChangePosition'], action.yScrollPosition || 0)
    .setIn(['currentPosition', 'height'], action.height || height)
    .setIn(['currentPosition', 'width'], action.width || width);
}

export function GRIDDLE_SET_FILTER_AFTER(state, action, helpers) {
  return state.setIn(['currentPosition', 'xScrollChangePosition'], 0)
              .setIn(['currentPosition', 'yScrollChangePosition'], 0);
}
