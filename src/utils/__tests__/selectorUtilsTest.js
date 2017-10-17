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
  const defaultSelectors = {
    simpleSelectorA: (state) => state,
  };

  const flattenedSelectors = composeSelectors(defaultSelectors, []);

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 1);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
});

test('composeSelectors with 2 simple selectors and 1 dependency selector dependent on the 2 simple selectors', (assert) => {
  const defaultSelectors = { 
    simpleSelectorA: () => 10,
    simpleSelectorB: () => 2,
    dependencySelector1: createSelector(
      "simpleSelectorA",
      "simpleSelectorB",
      (x, y) => x * y
    )
  };

  const flattenedSelectors = composeSelectors(defaultSelectors, []);

  assert.is(typeof flattenedSelectors, "object");
  assert.is(Object.keys(flattenedSelectors).length, 3);
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorA"));
  assert.true(flattenedSelectors.hasOwnProperty("simpleSelectorB"));
  assert.true(flattenedSelectors.hasOwnProperty("dependencySelector1"));
  assert.is(flattenedSelectors.dependencySelector1(), 20);
});
