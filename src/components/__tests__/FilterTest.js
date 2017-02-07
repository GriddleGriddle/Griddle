import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import Filter from '../Filter';

test('renders', (t) => {
  const wrapper = shallow(<Filter />);
  t.true(wrapper.matchesElement(<input />));
});

test('renders with style', (t) => {
  const style = { backgroundColor: "#EDEDED" };
  const wrapper = shallow(<Filter style={style} />);

  t.true(wrapper.matchesElement(<input style={{ backgroundColor: "#EDEDED" }} />));
});

test('renders with className', (t) => {
  const wrapper = shallow(<Filter className="className" />);

  t.true(wrapper.matchesElement(<input className="className" />));
});

test('calls setFilter on change', (t) => {
  let calledSetFilter = false;
  const setFilter = (e) => calledSetFilter = true;
  const wrapper = shallow(<Filter setFilter={setFilter} />);

  wrapper.simulate('change',
    { target: { value: 'abc' } }
  );

  t.true(calledSetFilter);
});