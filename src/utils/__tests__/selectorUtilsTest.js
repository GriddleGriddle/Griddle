import test from 'ava';

import {
  createSelector,
  composeSelectors
} from '../selectorUtils';

test('createSelector with only 1 argument should throw an Error', (t) => {
  const error = t.throws(() => {
    createSelector(
      (state) => state
    );
  }, Error);
});

test('createSelector with final results function arg not of function type', (assert) => {
  const error = assert.throws(() => {
    createSelector(
      "someDependency",
      "badResultFunctionStringArg"
    );
  }, Error);
});

test('createSelector with 1 selector function arg and 1 results function arg', (assert) => {
  const selector = createSelector(
    (state) => state,
    (state) => state
  );

  assert.is(typeof selector, "function");
  assert.is(selector.dependencies, undefined);
});

test('createSelector with 1 selector dependency and 1 results function', (assert) => {
  const selector = createSelector(
    "someDependency",
    (a) => null
  );

  assert.is(typeof selector, "function");
  assert.is(typeof selector.dependencies, "object");
  assert.is(selector.dependencies.length, 1);
  assert.is(selector.dependencies[0], "someDependency");
});

test('createSelector with 1 function dependency, 1 selector dependency, and 1 results function', (assert) => {
  const selector = createSelector(
    (state) => state,
    "someDependency",
    (state, x) => null
  );

  assert.is(typeof selector, "function");
  assert.is(typeof selector.dependencies, "object");
  assert.is(selector.dependencies.length, 1);
  assert.is(selector.dependencies[0], "someDependency");
});

test('createSelector with a non string or function argument for one of the first n - 1 args', (assert) => {
  const error = assert.throws(() => {
    createSelector(
      42,
      (x) => null
    );
  }, Error);
});

test('createSelector with 1 selector dependency and 1 results function, ' +
  'then call the returned generator function with valid resolved dependencies', (assert) => {
    const resolvedDependencies = {
      someDependency: () => 42
    };

    const selector = createSelector(
      "someDependency",
      (x) => x
    )(resolvedDependencies);

    assert.is(selector(), 42);
  });

test('createSelector with 1 selector function, 1 selector dependency, and 1 results function ' +
  'then call the returned generator function with valid resolved dependencies', (assert) => {
    const someFunction = () => 10;

    const resolvedDependencies = {
      someDependency: () => 42
    };

    const selector = createSelector(
      someFunction,
      "someDependency",
      (x, y) => x * y
    )(resolvedDependencies);

    assert.is(selector(), 420);
  });

test('createSelector with 1 selector dependency, and 1 results function' +
  'then call the returned generator function WITHOUT valid resolved dependencies', (assert) => {
    const error = assert.throws(() => {
      createSelector(
        "someDependency",
        (x) => x
      )({});
    }, Error);
  });

test('composeSelectors with 1 simple selector', (assert) => {
  const plugin0 = {
    selectors: {
      simpleSelectorA: (state) => state,
    }
  };

  const flattenedSelectors = composeSelectors([plugin0]);

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 1);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
});

test('composeSelectors with 2 simple selectors and 1 dependency selector dependent on the 2 simple selectors', (assert) => {
  const plugin0 = {
    selectors: {
      simpleSelectorA: () => 10,
      simpleSelectorB: () => 2,
      dependencySelector1: createSelector(
        'simpleSelectorA',
        'simpleSelectorB',
        (x, y) => x * y
      )
    }
  }

  const flattenedSelectors = composeSelectors([plugin0]);

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 3);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorB"));
  assert.true(flattenedSelectors.hasOwnProperty("dependencySelector1"));
  assert.is(flattenedSelectors.dependencySelector1(), 20);
  // this is a crucial test, the composeSelectors function must also trigger
  // the first run of createSelector's returned selector generator which
  // changes its behaviour. From now on this function will act like 
  // a selector created by reselect's createSelector
  assert.is(plugin0.selectors.simpleSelectorA(), 10);
  assert.is(plugin0.selectors.simpleSelectorB(), 2);
  assert.is(plugin0.selectors.dependencySelector1(), 20);
});

test('name me', (assert) => {
  const plugin0 = {
    selectors: {
      simpleSelectorA: () => 10,
      simpleSelectorB: () => 2,
      dependencySelector1: createSelector(
        'simpleSelectorA',
        'simpleSelectorB',
        (x, y) => x * y
      )
    }
  }

  const plugin1 = {
    selectors: {
      dependencySelector1: createSelector(
        'simpleSelectorA',
        'simpleSelectorB',
        (x, y) => x + y
      )
    }
  }

  const flattenedSelectors = composeSelectors([plugin0, plugin1]);

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 3);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorB"));
  assert.true(flattenedSelectors.hasOwnProperty("dependencySelector1"));


  assert.is(flattenedSelectors.simpleSelectorA(), 10);
  assert.is(flattenedSelectors.simpleSelectorB(), 2);
  assert.is(flattenedSelectors.dependencySelector1(), 12);

  // this is a crucial test, the composeSelectors function must also trigger
  // the first run of createSelector's returned selector generator which
  // changes its behaviour. From now on this function will act like 
  // a selector created by reselect's createSelector
  assert.is(plugin0.selectors.simpleSelectorA(), 10);
  assert.is(plugin0.selectors.simpleSelectorB(), 2);
  assert.is(plugin0.selectors.dependencySelector1(), 12);

  assert.is(plugin1.selectors.dependencySelector1(), 12);
});

test('name me', (assert) => {
  const plugin0 = (() => {
    const simpleSelectorA = () => 10;
    const simpleSelectorB = () => 2;
    return {
      selectors: {
        simpleSelectorA,
        simpleSelectorB,
        dependencySelector1: createSelector(
          simpleSelectorA,
          simpleSelectorB,
          (x, y) => x * y
        )
      }
    }
  }
  )();

  const plugin1 = {
    selectors: {
      dependencySelector1: createSelector(
        'simpleSelectorA',
        'simpleSelectorB',
        (x, y) => x + y
      )
    }
  }

  const flattenedSelectors = composeSelectors([plugin0, plugin1]);

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 3);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorB"));
  assert.true(flattenedSelectors.hasOwnProperty("dependencySelector1"));


  assert.is(flattenedSelectors.simpleSelectorA(), 10);
  assert.is(flattenedSelectors.simpleSelectorB(), 2);
  assert.is(flattenedSelectors.dependencySelector1(), 12);

  // this is a crucial test, the composeSelectors function must also trigger
  // the first run of createSelector's returned selector generator which
  // changes its behaviour. From now on this function will act like 
  // a selector created by reselect's createSelector
  assert.is(plugin0.selectors.simpleSelectorA(), 10);
  assert.is(plugin0.selectors.simpleSelectorB(), 2);
  // this selector was declared using selector function arguments
  // instead of selector dependency arguments, this means it
  // will NOT be overridden and it should keep its original
  // behaviour. Note that only the function in the PLUGIN
  // maintains this behaviour, the function returned in
  // flattenedSelectors uses the overridden dependencySelector1
  // from plugin1 as it was the most recently declared selector
  assert.is(plugin0.selectors.dependencySelector1(), 20);

  assert.is(plugin1.selectors.dependencySelector1(), 12);
});

test('composeSelectors called with mixed selector function and selector dependency createSelector selectors', (assert) => {
  const plugin0 = (() => {
    const simpleSelectorA = () => 10;
    const simpleSelectorB = () => 2;
    return {
      selectors: {
        simpleSelectorA,
        simpleSelectorB,
        dependencySelector1: createSelector(
          'simpleSelectorA',
          'simpleSelectorB',
          (x, y) => x * y
        ),
        dependencySelector2: createSelector(
          simpleSelectorA,
          'simpleSelectorB',
          (x, y) => x * y
        )
      }
    }
  }
  )();

  const plugin1 = {
    selectors: {
      simpleSelectorA: () => 40,
      simpleSelectorB: () => 1
    }
  }

  const flattenedSelectors = composeSelectors([plugin0, plugin1]);

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 4);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorB"));
  assert.true(flattenedSelectors.hasOwnProperty("dependencySelector1"));
  assert.true(flattenedSelectors.hasOwnProperty("dependencySelector2"));

  /* In the scenario, dependencySelector2 is using hybrid selection function
   * and selector dependency arguments. This means that the selector dependency
   * argument 'simpleSelectorB' is open to be overridden, it will use whatever
   * is the latest version of simpleSelectorB, in this case the one from plugin1.
   * However, the selector function argument simpleSelectorA will NEVER be overridden
   * for this selector and will thus use the simpleSelectorA function as statically
   * defined in plugin0. Selector function arguments will always point to the function
   * they were originally referencing. PLEASE NOTE that if the static function
   * the argument references is ITSELF LATER OVERRIDDEN it will of course use the new
   * overridden version.
   */


  assert.is(flattenedSelectors.simpleSelectorA(), 40);
  assert.is(flattenedSelectors.simpleSelectorB(), 1);
  assert.is(flattenedSelectors.dependencySelector1(), 40);
  assert.is(flattenedSelectors.dependencySelector2(), 10);

  // this is a crucial test, the composeSelectors function must also trigger
  // the first run of createSelector's returned selector generator which
  // changes its behaviour. From now on this function will act like 
  // a selector created by reselect's createSelector
  assert.is(plugin0.selectors.simpleSelectorA(), 10);
  assert.is(plugin0.selectors.simpleSelectorB(), 2);
  // this selector was declared using selector function arguments
  // instead of selector dependency arguments, this means it
  // will NOT be overridden and it should keep its original
  // behaviour. Note that only the function in the PLUGIN
  // maintains this behaviour, the function returned in
  // flattenedSelectors uses the overridden dependencySelector1
  // from plugin1 as it was the most recently declared selector
  assert.is(plugin0.selectors.dependencySelector1(), 40);
  assert.is(plugin0.selectors.dependencySelector2(), 10);

  assert.is(plugin1.selectors.simpleSelectorA(), 40);
  assert.is(plugin1.selectors.simpleSelectorB(), 1);
});

test('name me', (assert) => {
  const plugin0 = {
    selectors: {
      simpleSelectorA: () => 10,
      simpleSelectorB: () => 2,
      dependencySelector1: createSelector(
        'simpleSelectorA',
        'simpleSelectorB',
        (x, y) => x * y
      )
    }
  }

  const flattenedSelectors = composeSelectors([plugin0]);

  const createdDependencySelector1 = plugin0.selectors.dependencySelector1.factory();

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 3);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorB"));
  assert.true(flattenedSelectors.hasOwnProperty("dependencySelector1"));
  assert.is(flattenedSelectors.dependencySelector1(), 20);
  // this is a crucial test, the composeSelectors function must also trigger
  // the first run of createSelector's returned selector generator which
  // changes its behaviour. From now on this function will act like 
  // a selector created by reselect's createSelector
  assert.is(plugin0.selectors.simpleSelectorA(), 10);
  assert.is(plugin0.selectors.simpleSelectorB(), 2);
  assert.is(plugin0.selectors.dependencySelector1(), 20);

  assert.is(plugin0.selectors.dependencySelector1.factory()(), 20);
  assert.is(plugin0.selectors.dependencySelector1(), 20);
  assert.is(flattenedSelectors.dependencySelector1.factory()(), 20);
  assert.is(flattenedSelectors.dependencySelector1(), 20);

  assert.is(flattenedSelectors.dependencySelector1.factory({simpleSelectorA: () => 30})(), 60);
  assert.is(flattenedSelectors.dependencySelector1(), 20);
  assert.is(plugin0.selectors.dependencySelector1.factory({simpleSelectorA: () => 20})(), 40);
  assert.is(plugin0.selectors.dependencySelector1(), 20);
});
