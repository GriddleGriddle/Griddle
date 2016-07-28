import test from 'ava';
import { extendArray } from '../compositionUtils';

test('combine works', test => {
  const itemOne = { one: 'one', three: 'three' };
  const itemTwo = { two: 'two', four: 'four' };
  const itemThree = { three: 'san', four: 'shi' };
  const itemFour = { four: 'four' };

  const combined = extendArray([itemOne, itemTwo, itemThree, itemFour]);

  test.deepEqual(combined, { one: 'one', two: 'two', three: 'san', four: 'four' })
});
