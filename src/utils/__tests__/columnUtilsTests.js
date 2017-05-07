import test from 'ava';

import { getColumnProperties } from '../columnUtils';

test('get column properties works with array', test => {
  const rowProperties = {
    props: {
      children: [
        { props: { id: 1, name: "one"}},
        { props: { id: 2, name: "two", order: 5 }}
      ]
    }
  };

  const columnProperties = getColumnProperties(rowProperties);

  test.deepEqual(columnProperties, {
    1: { id: 1, name: "one", order: 1000 },
    2: { id: 2, name: "two", order: 5 },
  });
});

test('get column properties works with single column property object', test => {
  const rowProperties = {
    props: {
      children: { props: { id: 1, name: 'one' }},
    }
  };

  const columnProperties = getColumnProperties(rowProperties);

  test.deepEqual(columnProperties, {
    1: { id: 1, name: 'one', order: 1000 },
  });
});

test('get column properties returns all columns when no property columns specified', test => {
  const rowProperties = {
    props: {}
  };

  const allColumns = ['one', 'two', 'three'];

  const columnProperties = getColumnProperties(rowProperties, allColumns);

  test.deepEqual(columnProperties, {
    one: { id: 'one', order: 1000 },
    two: { id: 'two', order: 1001 },
    three: { id: 'three', order: 1002 }
  });
});

test('get column properties ignores falsy values in array', test => {
  const rowProperties = {
    props: {
      children: [
        { props: { id: 1, name: "one"}},
        0,
        undefined,
        null,
        false,
      ]
    }
  };

  const columnProperties = getColumnProperties(rowProperties);

  test.is(Object.keys(columnProperties).length, 1);
});
