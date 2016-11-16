export function XY_POSITION_CHANGED(state, action) {
  return state
    .setIn(['positionSettings', 'xScrollPosition'], action.xScrollPosition || 0)
    .setIn(['positionSettings', 'yScrollPosition'], action.yScrollPosition || 0);
}
