import test from 'ava';
import {
  extendArray,
  getPropertiesByEnding,
  getObjectWherePropertyEndsWith,
  composeReducer,
  composeReducers,
  composeReducersAndAddHooks,
  getKeysForObjects,
  composeReducerObjects
} from '../compositionUtils';

test('combine works', test => {
  const itemOne = { one: 'one', three: 'three' };
  const itemTwo = { two: 'two', four: 'four' };
  const itemThree = { three: 'san', four: 'shi' };
  const itemFour = { four: 'four' };

  const combined = extendArray([itemOne, itemTwo, itemThree, itemFour]);

  test.deepEqual(combined, { one: 'one', two: 'two', three: 'san', four: 'four' })
});

test('gets property names by ending', test => {
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

test('gets a composed reducer in the correct order', test => {
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

test('it can compose multiple reducers', test => {
  const reducer1 = function(state, action) {
    return { number: state.number + 5 };
  }

  const reducer2 = function(state, action) {
    return { number: state.number * 10 };
  }

  const reducer3 = function(state, action) {
    return { number: state.number - 1 };
  }

  const reducers = [reducer1, reducer2, reducer3];
  const composed = composeReducers(reducers);

  test.deepEqual(composed({ number: 5}), { number: 99 });

  const reducers2 = [reducer2, reducer3, reducer1];
  const composed2 = composeReducers(reducers2);

  test.deepEqual(composed2({ number: 5 }), { number: 54 });

  const reducers3 = [reducer3, reducer1, reducer2];
  const composed3 = composeReducers(reducers3);

  test.deepEqual(composed3({ number: 5 }), { number: 90 });
});

// TODO: This belongs in an object helper
test('it gets keys for objects', test => {
  const object1 = { one: 'one', two: 'two' };
  const object2 = { three: 'three', four: 'four' };
  const object3 = { one: 'one', five: 'five' };
  const object4 = { one: 'one', six: 'six', two: 'two' };

  const objects = [object1, object2, object3, object4];

  const keys = getKeysForObjects(objects);
  test.deepEqual(keys, ['one', 'two', 'three', 'four', 'five', 'six']);
});

// TODO: This belongs in reducer utils
test('composes reducer objects', test => {
  const FakeInitialReducer = {
    REDUCE_THING: (state, action) => {
      return { number: state.number + 5 }
    }
  }

  const FakePluginReducer = {
    REDUCE_THING: (state, action) => {
      return { number: state.number * 10 }
    },
    REDUCE_OTHER_THING: (state, action) => {
      return { number: state.number * 100 }
    }
  }

  const reducers = [FakeInitialReducer, FakePluginReducer];
  const reducer = composeReducerObjects(reducers);

  test.deepEqual(reducer.REDUCE_THING({ number: 5 }), { number: 55 });

  // ensure that plugins with new reducer methods work
  test.deepEqual(reducer.REDUCE_OTHER_THING({ number: 5 }), { number: 500 });
});
