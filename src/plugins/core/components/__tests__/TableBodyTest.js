import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import TableBody from '../TableBody';

test('renders with style', (t) => {
  const style = { backgroundColor: '#EDEDED' };
  const wrapper = shallow(<TableBody style={style} />);

  t.true(wrapper.matchesElement(<tbody style={{ backgroundColor: '#EDEDED' }} />));
});

test('renders with className', (t) => {
  const wrapper = shallow(<TableBody className="className" />);

  t.true(wrapper.matchesElement(<tbody className="className" />));
});

test('renders Row for rowIds', (t) => {
  const rowIds = [1, 2, 3, 4, 5];
  const Row = ({key, griddleKey}) => <tr key={key}><td>{griddleKey}</td></tr>;
  const wrapper = shallow(<TableBody Row={Row} rowIds={rowIds} />);

  t.true(wrapper.matchesElement(
    <tbody>
      <Row key={1} griddleKey={1} />
      <Row key={2} griddleKey={2} />
      <Row key={3} griddleKey={3} />
      <Row key={4} griddleKey={4} />
      <Row key={5} griddleKey={5} />
    </tbody>
  ));
});
