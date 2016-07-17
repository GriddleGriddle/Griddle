import test from 'ava';
import Immutable from 'immutable';

import * as selectors from '../dataSelectors';

const initialState = new Immutable.Map();

test('gets data', t => {
  const state = initialState.set('data', 'hi');
  t.is(selectors.dataSelector(state), 'hi');
})
