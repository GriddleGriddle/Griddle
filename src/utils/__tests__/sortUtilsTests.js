import test from 'ava';
import { fromJS } from 'immutable';

import { defaultSort } from '../sortUtils';

const testData = fromJS([
  {
    name: 'cool2',
    location: {
      city: 'city2',
    }
  },
  {
    name: 'cool1',
    location: {
      city: 'city1',
    }
  },
  {
    name: 'cool3',
    location: {
      city: 'city0',
    }
  }
]);

test('defaultSort sorts on column value', test => {
  const sortedData = defaultSort(testData, 'name');
  test.is(sortedData.get('0').get('name'), 'cool1');
});

test('defaultSort sorts in descending order', test => {
  const sortedData = defaultSort(testData, 'name', false);
  test.is(sortedData.get('0').get('name'), 'cool3');
});

test('defaultSort sorts in by nested data', test => {
  const sortedData = defaultSort(testData, 'location.city', true);
  test.is(sortedData.get('0').get('name'), 'cool3');
});
