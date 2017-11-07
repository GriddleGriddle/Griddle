import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import TableHeading from '../TableHeading';

test('renders', (t) => {
  const wrapper = shallow(<TableHeading />);

  t.true(wrapper.matchesElement(<thead><tr /></thead>));
});

test('renders with style', (t) => {
  const style = { backgroundColor: '#EDEDED' };
  const wrapper = shallow(<TableHeading style={style} />);

  t.true(wrapper.matchesElement(<thead style={{ backgroundColor: '#EDEDED' }}><tr /></thead>));
});

test('renders with className', (t) => {
  const wrapper = shallow(<TableHeading className="className" />);

  t.true(wrapper.matchesElement(<thead className="className"><tr /></thead>));
});

test('renders with TableHeadingCell for columnTitles and columnIds', (t) => {
  const columnTitles = ['one', 'two', 'three'];
  const columnIds = [1, 2, 3];
  const TableHeadingCell = ({key, title, columnId}) => <th key={key} dataColumnId={columnId}>{title}</th>;
  const wrapper = shallow(<TableHeading TableHeadingCell={TableHeadingCell} columnIds={columnIds} columnTitles={columnTitles}/>);

  t.true(wrapper.matchesElement(
    <thead>
      <tr>
        <TableHeadingCell key="one" title="one" columnId={1} />
        <TableHeadingCell key="two" title="two" columnId={2} />
        <TableHeadingCell key="three" title="three" columnId={3} />
      </tr>
    </thead>
  ));
});
