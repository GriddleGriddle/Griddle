import test from 'ava';

import init from '../initializer';

import { getColumnProperties } from '../columnUtils';
import { getRowProperties } from '../rowUtils';

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
  assert.deepEqual(res.reducers({}, { type: 'REDUCE' }), {});

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
  assert.deepEqual(Object.keys(res.reducers), Object.keys(defaults.reducers));
  assert.deepEqual(res.reducers({}, { type: 'REDUCE' }), { reduced: true });

  assert.deepEqual(res.reduxMiddleware, []);

  assert.deepEqual(ctx.components, defaults.components);
  assert.deepEqual(ctx.settingsComponentObjects, defaults.settingsComponentObjects);
  assert.deepEqual(ctx.events, {});
  assert.deepEqual(ctx.selectors, defaults.selectors);
  assert.deepEqual(ctx.listeners, {});
});

test('init returns expected initialState.data given props.data', (assert) => {
  const ctx = {
    props: {
      data: [{ foo: 'bar' }],
    },
  };
  const defaults = {};

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(res.initialState.data, ctx.props.data);
});

test('init returns expected initialState.renderProperties given props (children, plugins, user)', (assert) => {
  const ctx = {
    props: {
      children: {
        props: {
          children: [{ props: { id: 'foo', order: 1 } }],
        }
      },
      plugins: [
        { renderProperties: { plugin: 0, user: false } },
        { renderProperties: { plugin: 1 } },
      ],
      renderProperties: { user: true },
    },
  };
  const defaults = {};

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(res.initialState.renderProperties, {
    rowProperties: getRowProperties(ctx.props.children),
    columnProperties: getColumnProperties(ctx.props.children),
    plugin: 1,
    user: true,
  });
});
