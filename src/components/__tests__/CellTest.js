import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import Cell from '../Cell';

test('renders', (t) => {
  const wrapper = shallow(<Cell />);
  t.true(wrapper.matchesElement(<td />));
});

test('renders with correct value', (t) => {
  const wrapper = shallow(<Cell value="one two three" />);
  t.true(wrapper.matchesElement(<td>one two three</td>));
});

test('onClick works', (t) => {
  let clicked = false;

  const onClick = () => { clicked = true; };
  const wrapper = shallow(<Cell onClick={onClick} />);
  wrapper.simulate('click');

  t.true(clicked);
});

test('onMouseEnter works', (t) => {
  let over = false;

  const onMouseEnter = () => { over = true; };
  const wrapper = shallow(<Cell onMouseEnter={onMouseEnter} />);
  wrapper.simulate('mouseEnter');

  t.true(over);
});

test('onMouseLeave works', (t) => {
  let leave = false;

  const onMouseLeave = () => leave = true;
  const wrapper = shallow(<Cell onMouseLeave={onMouseLeave} />);
  wrapper.simulate('mouseLeave');

  t.true(leave);
});

test('class name gets applied', (t) => {
  const wrapper = shallow(<Cell className="test" />);
  t.true(wrapper.matchesElement(<td className="test" />));
});


