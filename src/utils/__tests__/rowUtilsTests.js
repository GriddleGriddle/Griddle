import test from 'ava';

import { getRowProperties } from '../rowUtils';

test('row utils gets object from react component', test => {
  const rowProperties = {
    props: {
      onHover: 'hi',
      onClick: 'hello',
      somethingElse: 'nothing',
      children: [
        { props: { id: 1, name: "one"}},
        { props: { id: 2, name: "two"}}
      ]
    }
  };
 
  const transformedRowProperties = getRowProperties(rowProperties);
  test.deepEqual(transformedRowProperties, {
    onHover: 'hi',
    onClick: 'hello',
    somethingElse: 'nothing',
    childColumnName: 'children'
  })
});

test('row utils uses provided childColumnName instead of default', test => {
   const rowProperties = {
    props: {
      onHover: 'hi',
      onClick: 'hello',
      somethingElse: 'nothing',
      childColumnName: 'somethingElse',
      children: [
        { props: { id: 1, name: "one"}},
        { props: { id: 2, name: "two"}}
      ]
    }
  };
 
  const transformedRowProperties = getRowProperties(rowProperties);
  test.deepEqual(transformedRowProperties, {
    onHover: 'hi',
    onClick: 'hello',
    somethingElse: 'nothing',
    childColumnName: 'somethingElse'
  })

})