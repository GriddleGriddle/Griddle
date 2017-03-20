import React, { Component } from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';


import Griddle from '../src/index';

import RowDefinition from '../src/components/RowDefinition';
import ColumnDefinition from '../src/components/ColumnDefinition';

import LocalPlugin from '../src/plugins/local';

const data = [
  {
    _id: 1,
    foo: 'hello',
    date: new Date('2017-02-15'),
    bar: 'world'
  },
  {
    _id: 2,
    foo: 'today',
    date: new Date(),
    bar: 'bar'
  }
];
storiesOf('Dateproblem', module)
  .add('with date in data', () => (
    <Griddle data={data} plugins={[LocalPlugin]}>
      <RowDefinition />
    </Griddle>
    ))
    .add('with custom component', () => (
      <Griddle data={data} plugins={[LocalPlugin]}>
        <RowDefinition>
          <ColumnDefinition id={'_id'} title="ID" />
          <ColumnDefinition id={'foo'} title="Foo" />
          <ColumnDefinition
            id={'date'} title="Date" customComponent={({ value }) => {
              console.log(value); // is empty Immutable.Map !
              return (
                <div>{value}</div>
              );
            }}
          />
          <ColumnDefinition
            id={'bar'} title="Bar" customComponent={({ value }) => {
              console.log(value); // is string, fine!
              return (
                <div>custom {value}</div>
              );
            }}
          />
        </RowDefinition>
      </Griddle>
      ));
