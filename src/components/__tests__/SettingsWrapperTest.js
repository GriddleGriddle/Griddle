import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import SettingsWrapper from '../SettingsWrapper';

test('renders if isEnabled', (t) => {
  const wrapper = shallow(<SettingsWrapper isEnabled />);

  t.true(wrapper.matchesElement(<div />));
});

test('renders with settings toggle when provided', (t) => {
  const settingsToggle = () => <div>Toggle</div>;
  const wrapper = shallow(<SettingsWrapper isEnabled SettingsToggle={settingsToggle} />);

  t.is(wrapper.html(), '<div><div>Toggle</div></div>');
});

test('renders with style', (t) => {
  const style = { backgroundColor: '#EDEDED' };
  const wrapper = shallow(<SettingsWrapper isEnabled style={style} />);

  t.true(wrapper.matchesElement(<div style={{ backgroundColor: '#EDEDED' }} />));
});

test('renders with className', (t) => {
  const wrapper = shallow(<SettingsWrapper isEnabled className="className" />);

  t.true(wrapper.matchesElement(<div className="className" />));
});

test('renders with settings if visible and settings component is provided', (t) => {
  const settings = () => <div>Settings</div>;
  const wrapper = shallow(<SettingsWrapper isEnabled isVisible Settings={settings} />);

  t.is(wrapper.html(), '<div><div>Settings</div></div>');
});

test('renders without settings if isVisible is false and settings component is provided', (t) => {
  const settings = () => <div>Settings</div>;
  const wrapper = shallow(<SettingsWrapper isEnabled isVisible={false} Settings={settings} />);

  t.is(wrapper.html(), '<div></div>');
});
