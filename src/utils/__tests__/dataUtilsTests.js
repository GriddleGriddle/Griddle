import test from 'ava';

import Immutable from 'immutable';

import {
  addKeyToCollection
} from '../dataUtils';

const collection = Immutable.fromJS([
  { name: 'one' },
  { name: 'two' },
  { name: 'three' }
]);

test('adds key default', test => {
  const newCollection = addKeyToCollection(collection);

  test.deepEqual(newCollection.toJSON(), [
    { name: 'one', griddleKey: 0 },
    { name: 'two', griddleKey: 1 },
    { name: 'three', griddleKey: 2 }
  ]);
});

test('adds key by name', test => {
  const newCollection = addKeyToCollection(collection, { name: 'newKeyName'});

  test.deepEqual(newCollection.toJSON(), [
    { name: 'one', newKeyName: 0 },
    { name: 'two', newKeyName: 1 },
    { name: 'three', newKeyName: 2 }
  ]);
});

test('starts at given index', test => {
  const newCollection = addKeyToCollection(collection, { startIndex: 5});

  test.deepEqual(newCollection.toJSON(), [
    { name: 'one', griddleKey: 5 },
    { name: 'two', griddleKey: 6 },
    { name: 'three', griddleKey: 7 }
  ]);
});
