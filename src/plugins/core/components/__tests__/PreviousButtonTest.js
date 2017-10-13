import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import PreviousButton from '../PreviousButton';

test('renders when hasPrevious is true', (t) => {
  const wrapper = shallow(<PreviousButton hasPrevious />);
  t.true(wrapper.matchesElement(<button />));
});

test('null when hasPrevious is false', (t) => {
  const wrapper = shallow(<PreviousButton hasPrevious={false} />);
  t.true(wrapper.matchesElement(null));
});

test('renders with style', (t) => {
  const style = { backgroundColor: '#EDEDED' };
  const wrapper = shallow(<PreviousButton hasPrevious style={style} />);

  t.true(wrapper.matchesElement(<button style={{ backgroundColor: '#EDEDED' }} />));
});

test('renders with className', (t) => {
  const wrapper = shallow(<PreviousButton hasPrevious className="className" />);

  t.true(wrapper.matchesElement(<button className="className" />));
});

test('renders with appropriate text', (t) => {
  const wrapper = shallow(<PreviousButton hasPrevious text="one two three" />);
  t.true(wrapper.matchesElement(<button>one two three</button>));
});

test('handles click', (t) => {
  let clicked = false;
  const onClick = () => { clicked = true; };

  const wrapper = shallow(<PreviousButton hasPrevious onClick={onClick} />);
  wrapper.simulate('click');

  t.true(clicked);
});

