import test from 'ava';

import init from '../initializer';

import { getColumnProperties } from '../columnUtils';
import { getRowProperties } from '../rowUtils';

const expectedDefaultInitialState = {
  data: [],
  pageProperties: {},
  renderProperties: {
    rowProperties: null,
    columnProperties: {},
  },
  sortProperties: {},
  styleConfig: {},
};

test('init succeeds given empty defaults and props', (assert) => {
  const ctx = { props: {} };
  const defaults = {};

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(res.initialState, expectedDefaultInitialState);

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
    ...expectedDefaultInitialState,

    init: true,
    data: ctx.props.data,
    pageProperties: defaults.pageProperties,
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

test('init returns expected initialState.pageProperties given props (user)', (assert) => {
  const ctx = {
    props: {
      pageProperties: { user: true },
    },
  };
  const defaults = {
    pageProperties: {
      defaults: true,
      user: false,
    },
  };

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(res.initialState.pageProperties, {
    defaults: true,
    user: true,
  });
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

test('init returns expected initialState.sortProperties given props (user)', (assert) => {
  const ctx = {
    props: {
      sortProperties: { user: true },
    },
  };
  const defaults = {};

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(res.initialState.sortProperties, {
    user: true,
  });
});

test('init returns merged initialState.styleConfig given props (plugins, user)', (assert) => {
  const ctx = {
    props: {
      plugins: [
        { styleConfig: { styles: { plugin: 0, user: false } } },
        { styleConfig: { styles: { plugin: 1, defaults: false } } },
      ],
      styleConfig: {
        styles: { user: true },
      },
    },
  };
  const defaults = {
    styleConfig: {
      classNames: { defaults: true },
      styles: { defaults: true, plugin: false, user: false },
    },
  };

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(res.initialState.styleConfig, {
    classNames: { defaults: true },
    styles: {
      defaults: false,
      plugin: 1,
      user: true,
    },
  });
});

test('init returns expected extra initialState given props (plugins, user)', (assert) => {
  const ctx = {
    props: {
      plugins: [
        { initialState: { plugin: 0, user: false } },
        { initialState: { plugin: 1 } },
      ],
      user: true,
    },
  };
  const defaults = {
    initialState: {
      defaults: true,
      user: false,
      plugin: false,
    }
  };

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(res.initialState, {
    ...expectedDefaultInitialState,

    defaults: true,
    user: true,
    plugin: 1,
  });
});
