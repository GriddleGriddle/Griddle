import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import Griddle from '../src/index';

import Cell from '../src/components/Cell';
import Row from '../src/components/Row';
import TableBody from '../src/components/TableBody';
import TableHeadingCell from '../src/components/TableHeadingCell';
import TableHeading from '../src/components/TableHeading';
import Table from '../src/components/Table';

import fakeData from './fakeData';

storiesOf('Griddle main', module)
  .add('with local', () => {
    return (
      <Griddle data={fakeData} />
    )
  })

storiesOf('Cell', module)
  .add('base cell', () => {
    const someValue = "hi from storybook"

    return <table>
      <tbody>
        <tr>
          <Cell value={someValue}
            className="someClass"
            style={{ fontSize: 20, color: "#FAB" }}
            onClick={() => console.log('clicked')}
            onMouseOver={() => console.log('mouse over')}
            onMouseOut={() => console.log('mouse out')}
          />
      </tr>
      </tbody>
    </table>
  });

storiesOf('Row', module)
  .add('base row', () => {
    const cells = [
      <td>One</td>,
      <td>Two</td>,
      <td>Three</td>
    ];

    return (
      <table>
        <tbody>
          <Row
            cells={cells}
            onClick={() => console.log('clicked')}
            onMouseOver={() => console.log('mouse over')}
            onMouseOut={() => console.log('mouse out')}
          />
        </tbody>
      </table>
    )
  })

storiesOf('TableBody', module)
  .add('base table body', () => {
    const rows = [
      <tr><td>One</td></tr>,
      <tr><td>Two</td></tr>,
      <tr><td>Three</td></tr>
    ];

    return (
      <table>
        <TableBody rows={rows} />
      </table>
    )
  })

storiesOf('TableHeadingCell', module)
  .add('base table heading cell', () => {
    return (
      <table>
        <thead>
          <tr>
            <TableHeadingCell
              title="New Title"
              onClick={() => console.log('clicked')}
              onMouseOver={() => console.log('mouse over')}
              onMouseOut={() => console.log('mouse out')}
            />
          </tr>
        </thead>
      </table>
    )
  })

storiesOf('TableHeading', module)
  .add('base table heading', () => {
    const headingCells = [
      <th>One</th>,
      <th>Two</th>,
      <th>Three</th>
    ]

    return (
      <table>
        <TableHeading headingCells={headingCells}/>
      </table>
    )
  })

storiesOf('Table', module)
  .add('base table', () => {
    const tableHeading = (
      <thead>
        <tr>
          <th>One</th>
          <th>Two</th>
          <th>Three</th>
        </tr>
      </thead>
    );

    const tableBody = (
      <tbody>
        <tr>
          <td>uno</td>
          <td>dos</td>
          <td>tres</td>
        </tr>
      </tbody>
    );

    return (
      <Table
        tableHeading={tableHeading}
        tableBody={tableBody}
      />
    );
  })
