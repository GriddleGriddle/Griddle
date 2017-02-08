import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import Table from '../Table';

test('renders', (t) => {
  const wrapper = shallow(<Table />);

  t.true(wrapper.matchesElement(<table />));
});

test('renders with style', (t) => {
  const style = { backgroundColor: '#EDEDED' };
  const wrapper = shallow(<Table style={style} />);

  t.true(wrapper.matchesElement(<table style={{ backgroundColor: '#EDEDED' }} />));
});

test('renders with className', (t) => {
  const wrapper = shallow(<Table className="className" />);

  t.true(wrapper.matchesElement(<table className="className" />));
});

test('renders TableHeading', (t) => {
  const TableHeading = () => <thead />;
  const wrapper = shallow(<Table TableHeading={TableHeading} />);

  t.true(wrapper.matchesElement(<table><TableHeading /></table>));
});

test('redners TableBody', (t) => {
  const TableBody = () => <tbody />;
  const wrapper = shallow(<Table TableBody={TableBody} />);

  t.true(wrapper.matchesElement(<table><TableBody /></table>));
});
