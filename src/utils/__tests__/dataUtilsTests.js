import test from 'ava';

import Immutable from 'immutable';

import {
  transformData,
} from '../dataUtils';

const collection = Immutable.fromJS([
  { name: 'one' },
  { name: 'two' },
  { name: 'three' }
]);

test('transforms data', test => {
  const data = [
    { first: 'Luke', last: 'Skywalker' },
    { first: 'Darth', last: 'Vader' }
  ];

  const transformedData = transformData(data, {});

  test.deepEqual(Object.keys(transformedData), ['data', 'lookup']);

  test.deepEqual(transformedData.data.toJSON(), [
    { first: 'Luke', last: 'Skywalker', griddleKey: 0 },
    { first: 'Darth', last: 'Vader', griddleKey: 1 }
  ]);

  test.deepEqual(transformedData.lookup.toJSON(), { 0: 0, 1: 1 });
});
