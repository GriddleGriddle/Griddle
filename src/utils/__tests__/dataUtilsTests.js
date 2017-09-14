import test from 'ava';

import Immutable from 'immutable';

import {
  hasData,
  transformData,
} from '../dataUtils';

const collection = Immutable.fromJS([
  { name: 'one' },
  { name: 'two' },
  { name: 'three' }
]);

test('hasData is false when data does not exist', (assert) => {
  const res = hasData({});
  assert.is(res, false);
});

[undefined, null].map(data =>
  test(`hasData is false when data is ${data}`, (assert) => {
    const res = hasData({ data });
    assert.is(res, false);
  })
);

test('hasData is false when data is empty', (assert) => {
  const res = hasData({ data: [] });
  assert.is(res, false);
});

test('hasData is false when data is not empty', (assert) => {
  const res = hasData({ data: [{}] });
  assert.is(res, true);
});

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
