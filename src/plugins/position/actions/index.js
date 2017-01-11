import {
  XY_POSITION_CHANGED,
} from '../constants';

export function setScrollPosition(xScrollPosition, xScrollMax, xVisible, yScrollPosition, yScrollMax, yVisible) {
  return {
    type: XY_POSITION_CHANGED,
    xScrollPosition,
    xScrollMax,
    xVisible,
    yScrollPosition,
    yScrollMax,
    yVisible
  };
}
