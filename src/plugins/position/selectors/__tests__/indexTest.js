import test from 'ava';
import Immutable from 'immutable';

import {
  visibleRecordCountSelector
} from '../index';

test('visible record count selector', test => {
  const state = new Immutable.fromJS({
    positionSettings: {
      rowHeight: 50,
      height: 600
    },
    currentPosition: {
      height: 600
    },
  });

  test.is(visibleRecordCountSelector(state), 12);
});

