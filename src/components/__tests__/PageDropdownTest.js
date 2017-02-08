import 'jsdom-global/register';
import React from 'react';
import test from 'ava';
import { shallow, mount } from 'enzyme';

import PageDropdown from '../PageDropdown';

// TODO: This whole test is pretty bad. I couldn't get the matches element working with option for some reason

test('renders with style', (t) => {
  const style = { backgroundColor: '#EDEDED' };
  const wrapper = shallow(<PageDropdown style={style} />);

  t.is(wrapper.node.type, 'select');
  t.is(wrapper.node.props.style, style);
});

test('renders with className', (t) => {
  const wrapper = shallow(<PageDropdown className="className" />);

  t.is(wrapper.node.type, 'select');
  t.is(wrapper.node.props.className, 'className');
});

test('renders with option element at page 0 if no pages provided', (t) => {
  const wrapper = shallow(<PageDropdown />);
  const option = wrapper.childAt(0);

  t.is(option.html(), '<option value="0">0</option>');
});

test('renders with as many option elements as max pages', (t) => {
  const wrapper = shallow(<PageDropdown maxPages={10} />);

  t.is(wrapper.children().length, 10);
});

test('renders at selected page', (t) => {
  // using mount because attempting to get selectedIndex later on
  const wrapper = mount(<PageDropdown currentPage={3} maxPages={10} />);

  const select = wrapper.find('select').node;
  t.is(select.selectedIndex, 2);
});

test('fires set page event', (t) => {
  let changed = false;
  const onChange = () => { changed = true; };
  const wrapper = mount(<PageDropdown currentPage={0} maxPages={10} setPage={onChange} />);
  wrapper.simulate('change', { target: { value: 3 } });
  t.true(changed);
});
