import test from 'ava';

import corePlugin from '../';

test('has expected keys', test => {
  test.truthy(corePlugin.components);
  test.truthy(corePlugin.settingsComponentObjects);
  test.truthy(corePlugin.reducer);
  test.truthy(corePlugin.selectors);
  test.truthy(corePlugin.actions);

  test.truthy(corePlugin.pageProperties);
  test.truthy(corePlugin.styleConfig);
  test.truthy(corePlugin.textProperties);
});
