import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import Table from '../Table';

test('renders', (t) => {
  const wrapper = shallow(<Table visibleRows={5} />);

  t.true(wrapper.matchesElement(<table />));
});

test('renders with style', (t) => {
  const style = { backgroundColor: '#EDEDED' };
  const wrapper = shallow(<Table style={style} visibleRows={5} />);

  t.true(wrapper.matchesElement(<table style={{ backgroundColor: '#EDEDED' }} />));
});

test('renders with className', (t) => {
  const wrapper = shallow(<Table className="className" visibleRows={5} />);

  t.true(wrapper.matchesElement(<table className="className" />));
});

test('renders TableHeading', (t) => {
  const TableHeading = () => <thead />;
  const wrapper = shallow(<Table TableHeading={TableHeading} visibleRows={5} />);

  t.true(wrapper.matchesElement(<table><TableHeading /></table>));
});

test('renders TableBody', (t) => {
  const TableBody = () => <tbody />;
  const wrapper = shallow(<Table TableBody={TableBody} visibleRows={5} />);

  t.true(wrapper.matchesElement(<table><TableBody /></table>));
});

test('renders NoResults when noRows', (t) => {
  const NoResults = () => <marquee />;
  const wrapper = shallow(<Table NoResults={NoResults} visibleRows={0} />);

  t.true(wrapper.matchesElement(<NoResults />));
});
