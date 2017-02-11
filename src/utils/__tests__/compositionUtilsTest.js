import test from 'ava';
import {
  extendArray,
  getPropertiesByEnding,
  getObjectWherePropertyEndsWith,
  composeReducer,
  composeReducers,
  combineReducersWithHooks,
  getKeysForObjects,
  composeReducerObjects,
  removeHooksFromObject,
  isKeyGriddleHook,
  buildGriddleReducer,
  buildGriddleReducerObject,
  getAfterHooksFromObject,
  getBeforeHooksFromObject,
  removeKeyNamePartFromObject,
  getBeforeReduceHooksFromObject,
  getAfterReduceHooksFromObject,
  combineAndEnhanceComponents,
  combineAndWrapWithContainerComponents,
  buildGriddleComponents,
  wrapMethodsByWordEnding
} from '../compositionUtils';

function getReducerArray() {
  const FakeInitialReducer = {
    REDUCE_THING: (state, action) => {
      return { number: state.number + 5 }
    }
  }

  const FakePluginReducer1 = {
    REDUCE_THING: (state, action) => {
      return { number: state.number * 10 }
    },
    REDUCE_THING_AFTER: (state, action) => {
      return { number: state.number * 100 }
    }
  };

  const FakePluginReducer2 = {
    REDUCE_THING_AFTER: (state, action) => {
      return { number: state.number - 100 };
    },
    REDUCE_THING_BEFORE: (state, action) => {
      return { number: state.number + 3 }
    }
  };

  return [
    FakeInitialReducer,
    FakePluginReducer1,
    FakePluginReducer2
  ]
}

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

  test.deepEqual(Object.keys(reducer), ['REDUCE_THING', 'REDUCE_OTHER_THING']);
  test.deepEqual(reducer.REDUCE_THING({ number: 5 }), { number: 100 });

  // ensure that plugins with new reducer methods work
  test.deepEqual(reducer.REDUCE_OTHER_THING({ number: 5 }), { number: 500 });
});

test('it removes hooks from reducer object', test => {
  const object = {
    ONE: 'one',
    ONE_AFTER: 'one_after',
    BEFORE_REDUCE: 'before_reduce',
    TWO: 'two',
    AFTER_REDUCE: 'after_reduce',
    TWO_BEFORE: 'two_before',
    TWO_AFTER: 'two_after'
  }

  test.deepEqual(removeHooksFromObject(object), { ONE: 'one', TWO: 'two' });
});

test('determines griddle hooks correctly', test => {
  test.true(isKeyGriddleHook('BEFORE_REDUCE'));
  test.true(isKeyGriddleHook('AFTER_REDUCE'));
  test.true(isKeyGriddleHook('ONE_BEFORE'));
  test.true(isKeyGriddleHook('ONE_AFTER'));

  test.false(isKeyGriddleHook('SOME_REDUCER'));
});

test('removes keyName part', test => {
  const object = {
    one_after: 'one',
    two_after: 'two',
    three_after: 'three'
  };

  test.deepEqual(removeKeyNamePartFromObject(object, '_after'), {
    one: 'one',
    two: 'two',
    three: 'three'
  });
});

test('gets after hooks', test => {
  const reducer = {
    REDUCE_THING_AFTER: (state, action) => {
      return { number: state.number - 100 };
    },
    REDUCE_THING_BEFORE: (state, action) => {
      return { number: state.number + 3 }
    }
  };

  test.deepEqual(Object.keys(getAfterHooksFromObject(reducer)), ['REDUCE_THING']);
  test.deepEqual(getAfterHooksFromObject(reducer).REDUCE_THING({ number: 5}), { number: -95 });
});

test('gets before hooks', test => {
  const reducer = {
    REDUCE_THING_AFTER: (state, action) => {
      return { number: state.number - 100 };
    },
    REDUCE_THING_BEFORE: (state, action) => {
      return { number: state.number + 3 }
    }
  };

  test.deepEqual(Object.keys(getBeforeHooksFromObject(reducer)), ['REDUCE_THING']);
  test.deepEqual(getBeforeHooksFromObject(reducer).REDUCE_THING({ number: 5}), { number: 8});
});

test('gets before reduce hooks', test => {
  const reducer = {
    BEFORE_REDUCE: (state, action) => {
      return { number: state.number + 2 };
    },
    REDUCE_THING_AFTER: (state, action) => {
      return { number: state.number - 100 };
    },
    REDUCE_THING_BEFORE: (state, action) => {
      return { number: state.number + 3 }
    }
  }

  test.deepEqual(Object.keys(getBeforeReduceHooksFromObject(reducer)), ['BEFORE_REDUCE']);
});

test('gets after reduce hooks', test => {
  const reducer = {
    AFTER_REDUCE: (state, action) => {
      return { number: state.number + 2 };
    },
    REDUCE_THING_AFTER: (state, action) => {
      return { number: state.number - 100 };
    },
    REDUCE_THING_BEFORE: (state, action) => {
      return { number: state.number + 3 }
    }
  }

  test.deepEqual(Object.keys(getAfterReduceHooksFromObject(reducer)), ['AFTER_REDUCE']);
});

test('builds griddle reducer', test => {
   const reducer1 = {
    REDUCE_THING: (state, action) => {
      return { number: state.number + 2 };
    },
    REDUCE_THING_AFTER: (state, action) => {
      return { number: state.number - 100 };
    },
    REDUCE_THING_BEFORE: (state, action) => {
      return { number: state.number + 3 }
    },
  };

  const reducer2 = {
    REDUCE_THING_AFTER: (state, action) => {
      return { number: state.number - 5 };
    },
    REDUCE_THING_BEFORE: (state, action) => {
      return { number: state.number * 7 }
    }
  }

  const reducer3 = {
    REDUCE_THING: (state, action) => {
      return { number: state.number + 4 }
    },
    REDUCE_OTHER: (state, action) => {
      return { number: state.number }
    }
  }

  const griddleReducer = buildGriddleReducerObject([reducer1, reducer2, reducer3]);

  test.deepEqual(Object.keys(griddleReducer), ['REDUCE_THING', 'REDUCE_OTHER']);
  test.deepEqual(griddleReducer.REDUCE_THING({ number: 5}), { number: -45 });
});

test('builds griddle reducer with BEFORE_REDUCE and AFTER_REDUCE', (t) => {
  const reducer1 = {
    BEFORE_REDUCE: (state, action) => {
      return { number: 10 }
    },
    REDUCE_THING: (state, action) => {
      return state;
    },
    AFTER_REDUCE: (state, action) => {
      return { number: state.number + 100 }
    }
  };

  const reducer2 = { 
    BEFORE_REDUCE: (state, action) => {
      return { number: state.number - 5 }
    },
    AFTER_REDUCE: (state, action) => {
      return { number: state.number - 50 }
    }
  }

  const griddleReducer = buildGriddleReducer([reducer1, reducer2]);
  const output = griddleReducer({number: 5}, { type: 'REDUCE_THING'});

  t.deepEqual(output, { number: 55 });
});

test('builds griddle reducer without BEFORE / AFTER if they dont exist', (t) => {
  const reducer1 = {
    REDUCE_THING: (state) => {
      return state;
    },
  };

  const reducer2 = { 
    REDUCE_THING_AFTER: (state) => {
      return { number: state.number + 10 };
    }
  };

  const griddleReducer = buildGriddleReducer([reducer1, reducer2]);
  const output = griddleReducer({number: 5}, { type: 'REDUCE_THING'});

  t.deepEqual(output, { number: 15 });
});

test('combineAndEnhanceComponents', test => {
  const initial = { one: (someNumber) => (someNumber + 5)}
  const enhancing = { oneEnhancer: originalMethod => (someNumber) => originalMethod(someNumber * 5)};

  const combined = combineAndEnhanceComponents([initial, enhancing]);

  test.is(combined.one(1), 10);
});

test('combineAndContainComponents', test => {
  const initial = { one: (someNumber) => (someNumber + 5)}
  const enhancing = { oneContainer: originalMethod => (someNumber) => originalMethod(someNumber * 5)};

  const combined = combineAndWrapWithContainerComponents([initial, enhancing]);

  test.is(combined.one(1), 10);
});

test('wrapMethodsByWordEnding composes methods', test => {
  const initial = {
    one: (someNumber) => {
      return (someNumber + 5)
    }
  };

  const oneContainer = {
    oneContainer: (someMethod) => (someNumber => someMethod(someNumber - 4))
  };

  const wrapped = wrapMethodsByWordEnding([initial, oneContainer], 'Container');

  test.is(wrapped.one(5), 6);
});

test('wrapMethodsByWordEnding flows containers / enhancers', test => {
  const container = {
    oneContainer: (someMethod) => (someNumber) => {
      return someMethod(someNumber + 5);
    }
  };

  // make sure that you can enhance containers
  const containerEnhancer = {
    oneContainerEnhancer: (someMethod) => (someNumber) => {
      return someMethod(someNumber - 10)
    }
  };

  // make sure that you can contain containers 🙃
  const containerContainer = {
    oneContainerContainer: (someMethod) => (someNumber) => {
      return someMethod(someNumber - 100)
    }
  };

  const initial = {
    one: (someNumber) => (someNumber + 3)
  }

  const wrappedWithContainerEnhancer = wrapMethodsByWordEnding([container, containerEnhancer], 'ContainerEnhancer', 'Container');
  test.is(wrappedWithContainerEnhancer.oneContainer(initial.one)(5), 3)

  // 🙃  
  const wrappedWithContainerContainer = wrapMethodsByWordEnding([container, containerContainer], 'ContainerContainer', 'Container');
  test.is(wrappedWithContainerContainer.oneContainer(initial.one)(5), -87); 
});

test('buildGriddleComponents wraps in containers and enhancers', test => {
  const initial = {
    one: (someNumber) => { 
      return (someNumber + 5)
    }
  };

  const containing = {
    oneContainer: originalMethod => (someNumber) => {
      return originalMethod(someNumber * 5)
    }
  };

  const enhancedContainer = {
    oneContainerEnhancer: originalMethod => (someNumber) => {
      return originalMethod(someNumber - 2)
    }
  };

  const enhancing = {
    oneEnhancer: originalMethod => (someNumber) => {
      return originalMethod(someNumber + 100)
    }
  };

  const combined = buildGriddleComponents([initial, containing, enhancedContainer, enhancing]);

  test.is(combined.one(5), 120);
});
