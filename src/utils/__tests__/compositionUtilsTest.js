import test from 'ava';
import {
  extendArray,
  getPropertiesByEnding,
  getObjectWherePropertyEndsWith,
  composeReducer
} from '../compositionUtils';

test('combine works', test => {
  const itemOne = { one: 'one', three: 'three' };
  const itemTwo = { two: 'two', four: 'four' };
  const itemThree = { three: 'san', four: 'shi' };
  const itemFour = { four: 'four' };

  const combined = extendArray([itemOne, itemTwo, itemThree, itemFour]);

  test.deepEqual(combined, { one: 'one', two: 'two', three: 'san', four: 'four' })
});

test('gets properties by ending', test => {
  const object = {
    one: 1,
    twoTEST: 2,
    three: 3,
    four: 4,
    fiveTEST: 5,
    six: 6
  };

  const filteredProperties = getPropertiesByEnding('TEST', object);
  test.deepEqual(filteredProperties, ['twoTEST', 'fiveTEST']);
});

test('gets object by property ending', test => {
  const object = {
    one: 1,
    twoTEST: 2,
    three: 3,
    four: 4,
    fiveTEST: 5,
    six: 6
  };

  const objectByEnding = getObjectWherePropertyEndsWith('TEST', object);
  test.deepEqual(objectByEnding, { twoTEST: 2, fiveTEST: 5});
})

test('gets a wrapped reducer in the correct order', test => {
  const reducer1 = function(state, action) {
    return { number: state.number + 5 };
  }

  const reducer2 = function(state, action) {
    return { number: state.number * 10 };
  }

  const composed1 = composeReducer(reducer1, reducer2);
  test.deepEqual(composed1({ number: 5 }), { number: 100 });

  const composed2 = composeReducer(reducer2, reducer1);
  test.deepEqual(composed2({ number: 5}), { number: 55 });
});

test('it has the correct action data in composed methods', test => {
  let action1, action2 = null;

  const reducer1 = function(state, action) {
    action1 = action;
    return state;
  }

  const reducer2 = function(state, action) {
    action2 = action;
    return state;
  }

  const composed = composeReducer(reducer1, reducer2)({ number: 5}, { type: 'Yo!' });
  test.not(action1, null);
  test.is(action1, action2);
  test.deepEqual(action1, { type: 'Yo!' });
});


