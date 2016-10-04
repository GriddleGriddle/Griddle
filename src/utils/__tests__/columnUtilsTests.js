import test from 'ava';

import { getColumnProperties, getColumnPropertiesFromColumnArray } from '../columnUtils';

test('get column properties from array returns object', test => {
  const columns = ['one', 'two', 'three'];
  const columnProperties = getColumnPropertiesFromColumnArray(columns);

  test.deepEqual(columnProperties, {
    one: { id: 'one' },
    two: { id: 'two' },
    three: { id: 'three' }
  });
});

test('get column properties works with array', test => {
  const rowProperties = {
    props: {
      children: [
        { props: { id: 1, name: "one"}},
        { props: { id: 2, name: "two"}}
      ]
    }
  };

  const columnProperties = getColumnProperties(rowProperties);

  test.deepEqual(columnProperties, {
    1: { id: 1, name: "one"},
    2: { id: 2, name: "two"}
  });
});

test('get column properties works with single column property object', test => {
  const rowProperties = {
    props: {
      children: { props: { id: 1, name: 'one' }}
    }
  };

  const columnProperties = getColumnProperties(rowProperties);

  test.deepEqual(columnProperties, {
    1: { id: 1, name: 'one' }
  });
});

test('get column properties returns all columns when no property columns specified', test => {
  const rowProperties = {
    props: {}
  }

  const allColumns = ['one', 'two', 'three'];

  const columnProperties = getColumnProperties(rowProperties, allColumns);

  test.deepEqual(columnProperties, {
    one: { id: 'one' },
    two: { id: 'two' },
    three: { id: 'three' }
  })
})