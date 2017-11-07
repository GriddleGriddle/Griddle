import test from 'ava';
import Immutable from 'immutable';
import { composeSelectors } from '../../../../utils/selectorUtils';

import * as coreSelectors from '../../../core/selectors/dataSelectors';
import * as localSelectors from '../../../local/selectors/localSelectors';

import {
  visibleRecordCountSelector
} from '../index';

import * as selectors from '../index';

test.beforeEach((test) => {
  test.context.selectors = composeSelectors([{selectors: {...coreSelectors}}, {selectors: {...localSelectors}}, {selectors}]);
});

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

  test.is(test.context.selectors.visibleRecordCountSelector(state), 12);
});

