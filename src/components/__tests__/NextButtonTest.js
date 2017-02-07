import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import NextButton from '../NextButton';

test('renders when hasNext is true', (t) => {
  const wrapper = shallow(<NextButton hasNext />);
  t.true(wrapper.matchesElement(<button />));
});

test('null when hasNext is false', (t) => {
  const wrapper = shallow(<NextButton hasNext={false} />);
  t.true(wrapper.matchesElement(null));
});

test('renders with style', (t) => {
  const style = { backgroundColor: '#EDEDED' };
  const wrapper = shallow(<NextButton hasNext style={style} />);

  t.true(wrapper.matchesElement(<button style={{ backgroundColor: '#EDEDED' }} />));
});

test('renders with className', (t) => {
  const wrapper = shallow(<NextButton hasNext className="className" />);

  t.true(wrapper.matchesElement(<button className="className" />));
});

test('renders with appropriate text', (t) => {
  const wrapper = shallow(<NextButton hasNext text="one two three" />);
  t.true(wrapper.matchesElement(<button>one two three</button>));
});

test('handles click', (t) => {
  let clicked = false;
  const onClick = () => { clicked = true; };

  const wrapper = shallow(<NextButton hasNext onClick={onClick} />);
  wrapper.simulate('click');

  t.true(clicked);
});
