import test from 'ava';
import Immutable from 'immutable';

import {
  XY_POSITION_CHANGED
} from '../index';

test('xy_position_changed sets position to 0 when not available', test => {
  const state = new Immutable.Map();
  const outputState = XY_POSITION_CHANGED(state, {});

  test.deepEqual(outputState.toJSON(), {
    positionSettings: {
      xScrollPosition: 0,
      yScrollPosition: 0,
      height: 0,
      width: 0
    }
  })
});

test('xy_position_changed sets position to action information', test => {
  const state = new Immutable.Map();
  const outputState = XY_POSITION_CHANGED(state, {
    yScrollPosition: 10,
    xScrollPosition: 20,
    height: 30,
    width: 40
  });

  test.deepEqual(outputState.toJSON(), {
    positionSettings: {
      xScrollPosition: 20,
      yScrollPosition: 10,
      height: 30,
      width: 40
    }
  })
});
