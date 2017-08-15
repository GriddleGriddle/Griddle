import test from 'ava';

import { mergeConnectParametersWithOptions } from '../griddleConnect';

test('makes options the fourth parameter even if connectOptions contains only one parameter', assert => {
  const mapStateToProps = (state, props) => {};
  const connectParams = [mapStateToProps];

  const output = mergeConnectParametersWithOptions(connectParams, { 'test': 'hi' });
  assert.deepEqual(
    output,
    [mapStateToProps, undefined, undefined, { 'test': 'hi' }]
  );
});

test('merges with existing options', assert => {
  const mapStateToProps = (state, props) => {};
  const action = () => { };
  const connectParams = [mapStateToProps, { someAction: action }, undefined, { 'one': 'two'}];

  const output = mergeConnectParametersWithOptions(connectParams, { 'test': 'hi' });
  assert.deepEqual(
    output,
    [mapStateToProps, { someAction: action }, undefined, { 'test': 'hi', 'one': 'two' }]
  );
})
