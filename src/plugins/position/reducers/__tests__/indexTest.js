import test from 'ava';
import Immutable from 'immutable';

import {
  XY_POSITION_CHANGED
} from '../index';

test('xy_position_changed sets position to 0 when not available', t => {
  const state = new Immutable.Map();
  const outputState = XY_POSITION_CHANGED(state, {});

  t.deepEqual(outputState.toJSON(), {
    currentPosition: {
      xScrollChangePosition: 0,
      yScrollChangePosition: 0,
      height: 0,
      width: 0
    }
  });
});

test('xy_position_changed sets position to action information', t => {
  const state = new Immutable.Map();
  const outputState = XY_POSITION_CHANGED(state, {
    yScrollPosition: 10,
    xScrollPosition: 20,
    height: 30,
    width: 40
  });

  t.deepEqual(outputState.toJSON(), {
    currentPosition: {
      xScrollChangePosition: 20,
      yScrollChangePosition: 10,
      height: 30,
      width: 40
    }
  });
});
