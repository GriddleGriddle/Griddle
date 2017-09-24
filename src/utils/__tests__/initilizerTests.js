import test from 'ava';

import init from '../initializer';

test('init succeeds given empty defaults and props', (assert) => {
  const ctx = { props: {} };
  const defaults = {};

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(res.initialState, {
    data: [],
    pageProperties: {},
    renderProperties: {
      rowProperties: null,
      columnProperties: {},
    },
    sortProperties: {},
    styleConfig: {},
  });

  assert.is(typeof res.reducers, 'function');

  assert.deepEqual(res.reduxMiddleware, []);

  assert.deepEqual(ctx.components, {});
  assert.deepEqual(ctx.settingsComponentObjects, {});
  assert.deepEqual(ctx.events, {});
  assert.deepEqual(ctx.selectors, {});
  assert.deepEqual(ctx.listeners, {});
});

test('init returns defaults given minimum props', (assert) => {
  const ctx = { props: { data: [] } };
  const defaults = {
    reducers: { REDUCE: () => ({ reduced: true }) },
    components: { Layout: () => null },
    settingsComponentObjects: { mySettings: { order: 10 } },
    selectors: { aSelector: () => null },
    styleConfig: { classNames: {} },
    pageProperties: { pageSize: 100 },
    initialState: { init: true },
  };

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(res.initialState, {
    init: true,
    data: ctx.props.data,
    pageProperties: defaults.pageProperties,
    renderProperties: {
      rowProperties: null,
      columnProperties: {},
    },
    sortProperties: {},
    styleConfig: defaults.styleConfig,
  });

  assert.is(typeof res.reducers, 'function');
  assert.deepEqual(res.reducers({}, { type: 'REDUCE' }), { reduced: true });

  assert.deepEqual(res.reduxMiddleware, []);

  assert.deepEqual(ctx.components, defaults.components);
  assert.deepEqual(ctx.settingsComponentObjects, defaults.settingsComponentObjects);
  assert.deepEqual(ctx.events, {});
  assert.deepEqual(ctx.selectors, defaults.selectors);
  assert.deepEqual(ctx.listeners, {});
});
