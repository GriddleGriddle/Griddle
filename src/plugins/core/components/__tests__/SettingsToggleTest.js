import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import SettingsToggle from '../SettingsToggle';

test('renders', (t) => {
  const wrapper = shallow(<SettingsToggle />);

  t.true(wrapper.matchesElement(<button />));
});

test('renders with style', (t) => {
  const style = { backgroundColor: '#EDEDED' };
  const wrapper = shallow(<SettingsToggle style={style} />);

  t.true(wrapper.matchesElement(<button style={{ backgroundColor: '#EDEDED' }} />));
});

test('renders with className', (t) => {
  const wrapper = shallow(<SettingsToggle className="className" />);

  t.true(wrapper.matchesElement(<button className="className" />));
});

test('fires on click', (t) => {
  let clicked = false;
  const onClick = () => { clicked = true; };
  const wrapper = shallow(<SettingsToggle onClick={onClick} />);
  wrapper.simulate('click');

  t.true(clicked);
});
