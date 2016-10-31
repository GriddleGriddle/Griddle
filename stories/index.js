import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import { withContext} from 'recompose';
import { connect } from 'react-redux';

import Griddle from '../src/index';
import Cell from '../src/components/Cell';
import Row from '../src/components/Row';
import TableBody from '../src/components/TableBody';
import TableHeadingCell from '../src/components/TableHeadingCell';
import TableHeading from '../src/components/TableHeading';
import { Table } from '../src/components/Table';
import TableContainer from '../src/components/TableContainer';
import ColumnDefinition from '../src/components/ColumnDefinition';
import RowDefinition from '../src/components/RowDefinition';
import _ from 'lodash';
import { rowDataSelector } from '../src/plugins/local/selectors/localSelectors';
import fakeData from './fakeData';

import LocalPlugin from '../src/plugins/local';
import ControlledPlugin from '../src/plugins/controlled';

function sortBySecondCharacter(data, column, sortAscending = true) {
  return data.sort(
    (original, newRecord) => {
      original = (!!original.get(column) && original.get(column)) || "";
      newRecord = (!!newRecord.get(column) && newRecord.get(column)) || "";

      if(original[1] === newRecord[1]) {
        return 0;
      } else if (original[1] > newRecord[1]) {
        return sortAscending ? 1 : -1;
      }
      else {
        return sortAscending ? -1 : 1;
      }
    });
}

// from mdn
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFakeData() {
  const start = getRandomIntInclusive(0, fakeData.length - 10);
  return fakeData.slice(start, start + 10);
}
const GreenLeftSortIconComponent = (props) => (
  <span style={{ color: "#00ff00" }}>
    {props.icon && <span>{props.icon}</span>}
    {props.title}
  </span>
)

const MakeBlueComponent = (props) => (
  <div style={{backgroundColor: '#0000FF'}}>
    {props.value}
    {props.rowData &&
      <small style={{ marginLeft: 5, opacity: .5}}>{props.rowData.company}</small>}
  </div>
)

const EnhanceWithRowData = connect((state, props) => ({
  rowData: rowDataSelector(state, props)
}));

const EnhancedCustomComponent = EnhanceWithRowData(MakeBlueComponent);

storiesOf('Griddle main', module)
  .add('with local', () => {
    return (
      <Griddle data={fakeData} plugins={[LocalPlugin]}>
        <RowDefinition>
        </RowDefinition>
      </Griddle>
    )
  })
  .add('with custom sort on name', () => {
    return (
      <div>
      <small>Sorts name by second character</small>
      <Griddle data={fakeData} plugins={[LocalPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} sortMethod={sortBySecondCharacter} />
          <ColumnDefinition id="state" order={1} />
        </RowDefinition>
      </Griddle>
      </div>
    );
  })
  .add('with custom component on name', () => {
    return (
      <div>
        <small>Everything in the name column should be blue</small>
       <Griddle data={fakeData} plugins={[LocalPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} customComponent={MakeBlueComponent} />
          <ColumnDefinition id="state" order={1} />
        </RowDefinition>
      </Griddle>
      </div>
    )
  })
  .add('with \'connected\' custom component', () => {
     return (
      <div>
        <small>Everything in the name column should be blue and we should now see the company name also</small>
       <Griddle data={fakeData} plugins={[LocalPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} customComponent={EnhancedCustomComponent} />
          <ColumnDefinition id="state" order={1} />
        </RowDefinition>
      </Griddle>
      </div>
    )
  })
.add('with controlled griddle component', () => {
  const data = getRandomFakeData();
  const events = {
    onFilter: (filter) => console.log('CALLBACK', filter)
  }
  return <Griddle data={data} events={events} />
})
  .add('with custom heading component', () => {
    return (
      <div>
        <small>Name should have a green heading component -- sort icon should show up on the left of the title</small>
       <Griddle data={fakeData} plugins={[LocalPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} customHeadingComponent={GreenLeftSortIconComponent} />
          <ColumnDefinition id="state" order={1} />
        </RowDefinition>
      </Griddle>

      </div>
    )
  })
  .add('with controlled', () => {
    const eventDefinition = {
      setFilter: () => {console.log('setFilter');},
      setSortProperties: () => {console.log('setSortProperties');},
      getNext: () => {console.log('getNext');},
      getPrevious: () => {console.log('getPrevious');},
      setPage: () => {console.log('setPage');}
    };

    return (
      <Griddle data={fakeData} events={eventDefinition} plugins={[LocalPlugin, ControlledPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} />
          <ColumnDefinition id="state" order={1} />
        </RowDefinition>
      </Griddle>
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
  })
  .add('CellContainer', () => {
    return (
      <Griddle data={fakeData} plugins={[LocalPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} />
          <ColumnDefinition id="state" order={1} />
        </RowDefinition>
      </Griddle>);
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
  .add('with local plugin container', () => {
    const testPlugin = {
      components: {
        Cell: ({griddleKey, columnId}) => <td>{`${griddleKey} ${columnId}`}</td>
      }
    };

    return (
      <Griddle data={fakeData} plugins={[LocalPlugin, testPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} />
          <ColumnDefinition id="state" order={1} />
        </RowDefinition>
      </Griddle>
    )
  })

storiesOf('TableBody', module)
  .add('base table body', () => {
    const rowIds = [1,2,3];

    const FakeRow = ({griddleKey}) => <tr><td>Row id: {griddleKey}</td></tr>;

    return (
      <table>
        <TableBody rowIds={rowIds} Row={FakeRow} />
      </table>
    )
  })
  .add('with local container', () => {
    const junkPlugin = {
      components: {
        Row: (props) => <tr><td>{props.griddleKey}</td></tr>,
        // override local row container
        RowContainer: original => props => original(props)
      }
    }

    return (
      <Griddle data={fakeData} plugins={[LocalPlugin, junkPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} />
          <ColumnDefinition id="state" order={1} />
        </RowDefinition>
      </Griddle>
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
    const columnTitles = ['one', 'two', 'three'];

    return (
      <table>
        <TableHeading columnTitles={columnTitles} TableHeadingCell={TableHeadingCell} />
      </table>
    )
  })

storiesOf('Table', module)
  .add('base table', () => {
    const tableHeading = props => (
      <thead>
        <tr>
          <th>One</th>
          <th>Two</th>
          <th>Three</th>
        </tr>
      </thead>
    );

    const tableBody = props => (
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
        TableHeading={tableHeading}
        TableBody={tableBody}
      />
    );
  })

storiesOf('TableContainer', module)
  .add('base', () => {
    const tableHeading = (props) => (
      <thead>
        <tr>
          <th>One</th>
          <th>Two</th>
          <th>Three</th>
        </tr>
      </thead>
    );

    const tableBody = (props) => (
      <tbody>
        <tr>
          <td>uno</td>
          <td>dos</td>
          <td>tres</td>
        </tr>
      </tbody>
    );

    class BaseWithContext extends React.Component {
      static childContextTypes = {
        components: React.PropTypes.object.isRequired
      }

      getChildContext() {
        return {
          components: {
            TableBody: tableBody,
            TableHeading: tableHeading
          }
        };
      }

      render() {
        return (
          <div>
            {this.props.children}
          </div>
        );
      }
    }

    const TableComposed = TableContainer(Table);

    return (
      <BaseWithContext>
        <TableComposed />
      </BaseWithContext>
    );
  })
