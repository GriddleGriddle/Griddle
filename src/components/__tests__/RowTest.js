import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import Row from '../Row';

test('renders', (t) => {
  const wrapper = shallow(<Row />);
  t.true(wrapper.matchesElement(<tr />));
});

test('renders with griddleKey', (t) => {
  const wrapper = shallow(<Row griddleKey={1} />);
  t.true(wrapper.matchesElement(<tr key={1} />));
});

test('renders with style', (t) => {
  const style = { backgroundColor: '#EDEDED' };
  const wrapper = shallow(<Row style={style} />);

  t.true(wrapper.matchesElement(<tr style={style} />));
});

test('renders with className', (t) => {
  const className = 'testClass';
  const wrapper = shallow(<Row className={className} />);

  t.true(wrapper.matchesElement(<tr className="testClass" />));
});

test('renders column ids', (t) => {
  const columnIds = [1, 2, 3];
  const cell = props => <div>{props.columnId}</div>;
  const wrapper = shallow(<Row columnIds={columnIds} Cell={cell} />);

  t.is(wrapper.children().at(0).html(), '<div>1</div>');
  t.is(wrapper.children().at(1).html(), '<div>2</div>');
  t.is(wrapper.children().at(2).html(), '<div>3</div>');
});
