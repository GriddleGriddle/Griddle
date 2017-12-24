import test from 'ava';
import _ from 'lodash';

import init from '../initializer';

import { getColumnProperties } from '../columnUtils';
import { getRowProperties } from '../rowUtils';

const expectedDefaultInitialState = {
  data: [],
  renderProperties: {
    rowProperties: null,
    columnProperties: {},
  },
  styleConfig: {},
};

test('init succeeds given null defaults and empty props', (assert) => {
  const ctx = { props: {} };
  const defaults = null;

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
    reducer: { REDUCE: () => ({ reduced: true }) },
    components: { Layout: () => null },
    settingsComponentObjects: { mySettings: { order: 10 } },
    selectors: { aSelector: () => null },
    styleConfig: { classNames: {} },
    pageProperties: { pageSize: 100 },
    init: true,
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
  assert.deepEqual(Object.keys(res.reducers), Object.keys(defaults.reducer));
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
    defaults: true,
    user: false,
    plugin: false,
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

test('init returns composed reducer given plugins', (assert) => {
  const ctx = {
    props: {
      plugins: [
        { reducer: { PLUGIN: () => ({ plugin: 0 }) } },
        { reducer: { PLUGIN: () => ({ plugin: 1 }) } },
      ],
    },
  };
  const defaults = {
    reducer: {
      DEFAULTS: () => ({ defaults: true }),
      PLUGIN: () => ({ plugin: false }),
    },
  };

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.is(typeof res.reducers, 'function');
  assert.deepEqual(Object.keys(res.reducers), ['DEFAULTS', 'PLUGIN']);
  assert.deepEqual(res.reducers({}, { type: 'DEFAULTS' }), { defaults: true });
  assert.deepEqual(res.reducers({}, { type: 'PLUGIN' }), { plugin: 1 });
});

test('init returns flattened/compacted reduxMiddleware given plugins', (assert) => {
  const mw = _.range(0, 4).map(i => () => i);
  const ctx = {
    props: {
      plugins: [
        {},
        { reduxMiddleware: [mw[0]] },
        {},
        { reduxMiddleware: [null, mw[1], undefined, mw[2], null] },
        {},
      ],
      reduxMiddleware: [null, mw[3], undefined],
    },
  };
  const defaults = {};

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(res.reduxMiddleware, mw);
});

test('init sets context.components as expected given plugins', (assert) => {
  const ctx = {
    props: {
      plugins: [
        { components: { Plugin: 0, User: false } },
        { components: { Plugin: 1 } },
      ],
      components: { User: true },
    },
  };
  const defaults = {
    components: {
      Defaults: true,
      Plugin: false,
    },
  };

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(ctx.components, {
    Defaults: true,
    Plugin: 1,
    User: true,
  });
});

test('init sets context.settingsComponentObjects as expected given plugins', (assert) => {
  const ctx = {
    props: {
      plugins: [
        { settingsComponentObjects: { Plugin: 0, User: false } },
        { settingsComponentObjects: { Plugin: 1 } },
      ],
      settingsComponentObjects: { User: true },
    },
  };
  const defaults = {
    settingsComponentObjects: {
      Defaults: true,
      Plugin: false,
    },
  };

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(ctx.settingsComponentObjects, {
    Defaults: true,
    Plugin: 1,
    User: true,
  });
});

test('init sets context.events as expected given plugins', (assert) => {
  const ctx = {
    props: {
      plugins: [
        { events: { Plugin: 0, User: false } },
        { events: { Plugin: 1 } },
      ],
      events: { User: true, User2: true },
    },
  };
  const defaults = {};

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(ctx.events, {
    Plugin: 1,
    User: false, // TODO: bug that plugins overwrite user events?
    User2: true,
  });
});

test('init sets context.selectors as expected given plugins', (assert) => {
  const ctx = {
    props: {
      plugins: [
        { selectors: { Plugin: 0 } },
        { selectors: { Plugin: 1 } },
      ],
    },
  };
  const defaults = {
    selectors: {
      Defaults: true,
      Plugin: false,
    },
  };

  const res = init.call(ctx, defaults);
  assert.truthy(res);

  assert.deepEqual(ctx.selectors, {
    Defaults: true,
    Plugin: 1,
  });
});


test('init sets context.listeners as expected given props (plugins, user)', (assert) => {
  const ctx = {
    props: {
      plugins: [
        { listeners: { plugin: () => 0, user: () => false } },
        { listeners: { plugin: () => 1 } },
      ],
      listeners: {
        user: () => true,
        user2: () => true,
      },
    },
  };
  const defaults = {};

  const res = init.call(ctx, defaults);
  assert.truthy(res);
  assert.truthy(res);

  assert.false('defaults' in ctx.listeners);
  assert.deepEqual(ctx.listeners.plugin(), 1);
  assert.deepEqual(ctx.listeners.user(), false); // TODO: bug that plugins overwrite user listeners?
  assert.deepEqual(ctx.listeners.user2(), true);
});
