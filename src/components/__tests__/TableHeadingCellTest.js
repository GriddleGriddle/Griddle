import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import TableHeadingCell from '../TableHeadingCell';

test('renders with style', (t) => {
  const style = { backgroundColor: '#EDEDED' };
  const wrapper = shallow(<TableHeadingCell style={style} />);

  t.true(wrapper.matchesElement(<th style={{ backgroundColor: '#EDEDED' }} />));
});

test('renders with className', (t) => {
  const wrapper = shallow(<TableHeadingCell className="className" />);

  t.true(wrapper.matchesElement(<th className="className" />));
});

test('renders title', (t) => {
  const wrapper = shallow(<TableHeadingCell title="Hi!!1!" />);

  t.true(wrapper.matchesElement(<th>Hi!!1!</th>));
});

test('fires onClick', (t) => {
  let clicked = false;
  const onClick = () => { clicked = true; };
  const wrapper = shallow(<TableHeadingCell onClick={onClick} />);

  wrapper.simulate('click');
  t.true(clicked);
});

test('fires onMouseEnter', (t) => {
  let hovered = false;
  const onMouseEnter = () => { hovered = true; };
  const wrapper = shallow(<TableHeadingCell onMouseEnter={onMouseEnter} />);

  wrapper.simulate('mouseEnter');
  t.true(hovered);
});

test('fires onMouseLeave', (t) => {
  let left = false;
  const onMouseLeave = () => { left = true; };
  const wrapper = shallow(<TableHeadingCell onMouseLeave={onMouseLeave} />);

  wrapper.simulate('mouseLeave');
  t.true(left);
});
