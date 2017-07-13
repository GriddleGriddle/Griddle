import * as React from 'react';
import PropTypes from 'prop-types';
import { module, storiesOf, action, linkTo } from '@kadira/storybook';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import withContext from 'recompose/withContext';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import _ from 'lodash';

import GenericGriddle, { actions, components, selectors, plugins, utils, ColumnDefinition, RowDefinition } from '../src/module';
const { Cell, Row, Table, TableContainer, TableBody, TableHeading, TableHeadingCell } = components;
const { SettingsWrapper, SettingsToggle, Settings } = components;

const { LegacyStylePlugin, LocalPlugin, PositionPlugin } = plugins;

import fakeData, { FakeData } from './fakeData';
import { person, fakeData2, personClass, fakeData3 } from './fakeData2';

type Griddle = new () => GenericGriddle<FakeData>;
const Griddle = GenericGriddle as Griddle;

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
  rowData: selectors.rowDataSelector(state, props)
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
  .add('with local and legacy (v0) styles', () => {
    return (
      <Griddle data={fakeData} plugins={[LocalPlugin, LegacyStylePlugin]} />
    )
  })
  .add('with local and events', () => {

    // don't do things this way - fine for example storybook
    const events = {
      onFilter: () => console.log('onFilter'),
      onSort: () => console.log('onSort'),
      onNext: () => console.log('onNext'),
      onPrevious: () => console.log('onPrevious'),
      onGetPage: () => console.log('onGetPage')
    }

    return (
      <Griddle data={fakeData} plugins={[LocalPlugin]} events={events}>
        <RowDefinition>
        </RowDefinition>
      </Griddle>
    )
  })
  .add('with Row & Cell events', () => {
    return (
      <Griddle
        data={fakeData}
        plugins={[LocalPlugin]}
        components={{
          RowEnhancer: OriginalComponent =>
            props => (
              <OriginalComponent
                {...props}
                onClick={() => console.log(`Click Row ${props.griddleKey}`)}
                onMouseEnter={() => console.log(`MouseEnter Row ${props.griddleKey}`)}
                onMouseLeave={() => console.log(`MouseLeave Row ${props.griddleKey}`)}
                />
            ),
          CellEnhancer: OriginalComponent =>
            props => (
              <OriginalComponent
                {...props}
                onClick={() => console.log(`Click ${props.value}`)}
                onMouseEnter={() => console.log(`MouseEnter ${props.value}`)}
                onMouseLeave={() => console.log(`MouseLeave ${props.value}`)}
                />
            ),
        }}
        styleConfig={{
          styles: {
            Table: { borderCollapse: 'collapse' }, // To prevent Row enter/leave between cells
          },
        }}
        />
    );
  })
  .add('with local and sort set', () => {
    const sortProperties = [
      { id: 'name', sortAscending: true }
    ];

    return (
      <Griddle data={fakeData} plugins={[LocalPlugin]} sortProperties={sortProperties}>
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
          <ColumnDefinition id="name" order={2} title="NAME" sortMethod={sortBySecondCharacter} />
          <ColumnDefinition id="state" order={1} />
        </RowDefinition>
      </Griddle>
      </div>
    );
  })
  .add('with sortable set to true/false', () => {
    return (
      <div>
      <small>Using ColumnDefinition sortable (false on name, true on state).</small>
      <Griddle data={fakeData} plugins={[LocalPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} sortable={false} />
          <ColumnDefinition id="state" order={1} sortable={true} />
        </RowDefinition>
      </Griddle>
      </div>
    );
  })
  .add('with sort disabled on name via plugin', () => {
    const { setSortProperties } = utils.sortUtils;
    const disableSortPlugin = (...columnsWithSortDisabled) => ({
      events: {
        setSortProperties: (sortProperties) => {
          const { columnId } = sortProperties;
          if (columnsWithSortDisabled.findIndex(c => c === columnId) >= 0) {
            return () => {};
          }

          return setSortProperties(sortProperties);
        }
      },
    });

    return (
      <div>
      <small>Using custom plugin to disable sort</small>
      <Griddle data={fakeData} plugins={[LocalPlugin,disableSortPlugin('name')]}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} />
          <ColumnDefinition id="state" order={1} />
        </RowDefinition>
      </Griddle>
      </div>
    );
  })
  .add('with custom css-class names on state', () => {
    const css = `
    tr:nth-child(2n+1) .customClassName {
      background-color: #eee;
    }

    .customHeaderClassName {
      color: red;
    }
    .blue { color: blue; }
    .asc { background-color: #666; color: white; }
    .desc { background-color: #999; color: black; }
    `;
    return (
      <div>
      <style type="text/css">
        {css}
      </style>
      <small>Sets dynamic (name - click to sort) and static (state) class names on header and body cells</small>
      <Griddle data={fakeData} plugins={[LocalPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name"
            headerCssClassName={({sortProperty}) => sortProperty && (sortProperty.sortAscending ? 'asc' : 'desc')}
            cssClassName={({value}) => value.startsWith('L') && 'blue'}
            />
          <ColumnDefinition id="state" cssClassName="customClassName" headerCssClassName="customHeaderClassName"/>
        </RowDefinition>
      </Griddle>
      </div>
    );
  })
  .add('with cssClassName string on RowDefinition', () => {
    const css = `
      .lucky { background-color: #cfc; color: #060; }
      `;
    return (
      <div>
      <style type="text/css">
        {css}
      </style>
      <small>Uses cssClassName to apply static class name</small>
      <Griddle data={fakeData} plugins={[LocalPlugin]}>
        <RowDefinition cssClassName="lucky">
          <ColumnDefinition id="name" />
          <ColumnDefinition id="state" />
        </RowDefinition>
      </Griddle>
      </div>
    );
  })
  .add('with cssClassName function on RowDefinition', () => {
    const css = `
      .row-1 { background-color: #ccc; }
      .row-2 { background-color: #999; }
      .lucky { background-color: #cfc; color: #060; }
      `;
    return (
      <div>
      <style type="text/css">
        {css}
      </style>
      <small>Uses cssClassName to apply calculated class names</small>
      <Griddle data={fakeData} plugins={[LocalPlugin]}>
        <RowDefinition cssClassName={({ rowData: d, index: i }) => d && d.favoriteNumber === 7 ? 'lucky' : `row-${i%3}`}>
          <ColumnDefinition id="name" />
          <ColumnDefinition id="state" />
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
          <ColumnDefinition id="name" order={2} customComponent={MakeBlueComponent} width={800}/>
          <ColumnDefinition id="state" order={1} width={100}/>
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

    class Something extends React.Component<{}, any> {
      constructor() {
        super();

        this.state = {
          data: getRandomFakeData(),
          sortProperties: {}
        };
      }

      onFilter = (filter) => {
        console.log('onFilter', filter);
        this.setState({ data: getRandomFakeData() })
      }

      onSort = (sortProperties) => {
        console.log('onSort', sortProperties);
        this.setState({
          data: getRandomFakeData(),
          sortProperties: {
            something: {
              ...sortProperties,
              sortAscending: getRandomIntInclusive(0,1) > 0 ? true : false
            }
          }
         })
      }

      onNext = () => {
        console.log('onNext');
        this.setState({ data: getRandomFakeData() })
      }

      onPrevious = () => {
        console.log('onPrevious');
        this.setState({ data: getRandomFakeData() })
      }

      onGetPage = (pageNumber) => {
        console.log('onGetPage', pageNumber);
        this.setState({ data: getRandomFakeData() })
      }

      render() {
        const pageProperties = {
          currentPage: getRandomIntInclusive(1, 10),
          recordCount: getRandomIntInclusive(1, 1000)
        }

        // don't do things this way - fine for example storybook
        const events = {
          onFilter: this.onFilter,
          onSort: this.onSort,
          onNext: this.onNext,
          onPrevious: this.onPrevious,
          onGetPage: this.onGetPage
        }

        return <Griddle
          data={this.state.data}
          events={events}
          styleConfig={{
            classNames:{
              Cell: 'hahaha',
            },
          }}
          sortProperties={this.state.sortProperties}
          pageProperties={pageProperties}>
            <RowDefinition>
              <ColumnDefinition id="name" width={500} style={{ color: "#FAB" }} />
              <ColumnDefinition id="state" />
            </RowDefinition>
          </Griddle>
      }
    }

    return <Something />
  })
  .add('with controlled griddle component with no results', () => {
    return <Griddle data={[]} />
  })
  .add('with extraData', () => {
    const customHeadingComponent =
      ({ title, extra }) =>
        <span>{title} {extra && <em> {extra}</em>}</span>;

    const customComponent =
      ({ value, extra }) =>
        <span>{value} {extra && <em> {extra}</em>}</span>;

    const components = {
      Cell: ({value, extra}) =>
        <td>{value} {extra && <strong> {extra}</strong>}</td>,
      TableHeadingCell: ({title, extra}) =>
        <th>{title} {extra && <strong> {extra}</strong>}</th>,
    };

    return (
      <div>
        <small><em>extra</em> from <code>custom(Heading)Component</code>; <strong>extra</strong> from <code>(TableHeading)Cell</code></small>
        <Griddle data={fakeData} plugins={[LocalPlugin]} components={components}>
          <RowDefinition rowKey="name">
            <ColumnDefinition id="name" order={2} extraData={{extra: 'extra'}}
              customHeadingComponent={customHeadingComponent} customComponent={customComponent} />
            <ColumnDefinition id="state" order={1} />
          </RowDefinition>
        </Griddle>
      </div>
    )
  })
  .add('with custom griddle key', () => {
    return (
      <div>
        <small>The key should be the name property </small>
        <Griddle data={fakeData} plugins={[LocalPlugin]}>
          <RowDefinition rowKey="name">
            <ColumnDefinition id="name" order={2} />
            <ColumnDefinition id="state" order={1} />
          </RowDefinition>
        </Griddle>
      </div>
    )
  })
  .add('with custom griddle key that doesn\'t exist', () => {
    return (
      <div>
        <small>The key should be the name property </small>
        <Griddle data={fakeData} plugins={[LocalPlugin]}>
          <RowDefinition rowKey="garbage">
            <ColumnDefinition id="name" order={2} />
            <ColumnDefinition id="state" order={1} />
          </RowDefinition>
        </Griddle>
      </div>
    )
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
  .add('with many columns', () => {
    return (
      <div>
        <small>
          State should be first, name should be last, and the rest should be in order.
          Default order increments from 1000.
        </small>
        <Griddle data={fakeData} plugins={[LocalPlugin]}>
          <RowDefinition>
            <ColumnDefinition id="name" order={2000} />
            <ColumnDefinition id="col1" />
            <ColumnDefinition id="col2" />
            <ColumnDefinition id="col3" />
            <ColumnDefinition id="col4" />
            <ColumnDefinition id="col5" />
            <ColumnDefinition id="col6" />
            <ColumnDefinition id="col7" />
            <ColumnDefinition id="state" order={1} />
          </RowDefinition>
        </Griddle>
      </div>
    );
  })
  .add('with conditional columns', () => {
    return (
      <div>
        <small>
          The first column should be visible, the second ignored.
        </small>
        <Griddle data={fakeData} plugins={[LocalPlugin]}>
          <RowDefinition>
            {true && <ColumnDefinition id="col1" />}
            {false && <ColumnDefinition id="col2" />}
          </RowDefinition>
        </Griddle>
      </div>
    );
  })
  .add('with override row component', () => {
    const NewRow = (props) => <tr><td>hi</td></tr>

    return <Griddle
      data={fakeData}
      components={{
        Row: NewRow
      }}
    />
  })
  .add('with list row component', () => {
    // Ported from https://github.com/GriddleGriddle/griddle-docs/blob/429f318778604c5e7500c1c949fe1c3137972419/components/GriddleList.js
    const CustomRowComponent = connect((state, props) => ({
      rowData: plugins.LocalPlugin.selectors.rowDataSelector(state, props)
    }))(({ rowData }) => (
      <div style={{
        backgroundColor: "#EEE",
        border: "1px solid #AAA",
        padding: 5,
        margin: "10px 0 10px 0",
      }}>
        <h1>{rowData.name}</h1>
        <ul>
          <li><strong>State</strong>: {rowData.state}</li>
          <li><strong>Company</strong>: {rowData.company}</li>
        </ul>
      </div>
    ));

    // HoC for overriding Table component to just render the default TableBody component
    // We could use this entirely if we wanted and connect and map over visible rows but 
    // Using this + tableBody to take advantange of code that Griddle LocalPlugin already has
    const CustomTableComponent = OriginalComponent =>
      class CustomTableComponent extends React.Component<{}> {
        static contextTypes = {
          components: React.PropTypes.object
        }

        render() {
          return <this.context.components.TableBody />
        }
      }

    const CustomTableBody = ({ rowIds, Row, style, className }) => (
      <div style={style} className={className}>
        { rowIds && rowIds.map(r => <Row key={r} griddleKey={r} />) }
      </div>
    );

    return (
      <Griddle
        data={fakeData}
        pageProperties={{
          pageSize: 5
        }}
        plugins={[plugins.LocalPlugin]}
        components={{
          Row: CustomRowComponent,
          TableContainer: CustomTableComponent,
          TableBody: CustomTableBody,
          SettingsToggle: (props) => null
        }}
      />
    );
  })
  .add('with virtual scrolling', () => {
    return (
      <Griddle data={fakeData} plugins={[LocalPlugin, PositionPlugin({ tableHeight: 300 })]}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} customHeadingComponent={GreenLeftSortIconComponent} width={300} />
          <ColumnDefinition id="state" order={1} width={400} />
        </RowDefinition>
      </Griddle>
    )
  })
  .add('set fakeData to constructed Objects', () => {
    type Griddle = new () => GenericGriddle<person>;
    const Griddle = GenericGriddle as Griddle;

    return (
      <Griddle data={fakeData2} plugins={[LocalPlugin]}>
        <RowDefinition>
        </RowDefinition>
      </Griddle>
    )
  })
  .add('set fakeData to class Objects', () => {
    type Griddle = new () => GenericGriddle<personClass>;
    const Griddle = GenericGriddle as Griddle;

    return (
      <Griddle data={fakeData3} plugins={[LocalPlugin]}>
        <RowDefinition>
        </RowDefinition>
      </Griddle>
    )
  })
  .add('with nested column data', () => {
    interface NestedData {
        id: number,
        name: string,
        location: {
            country: string,
            city: string,
            state: string,
        },
        company: string,
        favoriteNumber: number,
    }

    type Griddle = new () => GenericGriddle<NestedData>;
    const Griddle = GenericGriddle as Griddle;

    const localData: NestedData[] = [
      {
        "id": 0,
        "name": "Mayer Leonard",
        "location": {
          "country": "United Kingdom",
          "city": "Kapowsin",
          "state": "Hawaii",
        },
        "company": "Ovolo",
        "favoriteNumber": 7
      },
      {
        "id": 1,
        "name": "Koch Becker",
        "location": {
          "city": "Johnsonburg",
          "state": "New Jersey",
          "country": "Madagascar",
        },
        "company": "Eventage",
        "favoriteNumber": 2
      },
      {
        "id": 2,
        "name": "Lowery Hopkins",
        "location": {
          "city": "Blanco",
          "state": "Arizona",
          "country": "Ukraine",
        },
        "company": "Comtext",
        "favoriteNumber": 3
      },
      {
        "id": 3,
        "name": "Walters Mays",
        "location": {
          "city": "Glendale",
          "state": "Illinois",
          "country": "New Zealand",
        },
        "company": "Corporana",
        "favoriteNumber": 6
      },
      {
        "id": 4,
        "name": "Shaw Lowe",
        "location": {
          "city": "Coultervillle",
          "state": "Wyoming",
          "country": "Ecuador",
        },
        "company": "Isologica",
        "favoriteNumber": 2
      },
      {
        "id": 5,
        "name": "Ola Fernandez",
        "location": {
          "city": "Deltaville",
          "state": "Delaware",
          "country": "Virgin Islands (US)",
        },
        "company": "Pawnagra",
        "favoriteNumber": 7
      },
    ];

    return (
      <Griddle data={localData} plugins={[LocalPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name" />
          <ColumnDefinition id="location.state" nested={true}/>
        </RowDefinition>
      </Griddle>
    );
  })

storiesOf('Plugins', module)
  .add('styleConfig', () => {
    const stylePlugin = {
      components: {
        Style: () =>
          <style type="text/css">
            {`
              .plugin-layout {
                border: 5px solid green;
                padding: 5px;
              }
              .plugin-row:nth-child(2n+1) {
                background-color: #eee;
              }
            `}
          </style>
      },
      styleConfig: {
        icons: {
          TableHeadingCell: {
            sortDescendingIcon: ' (desc)',
            sortAscendingIcon: ' (asc)'
          },
        },
        classNames: {
          Layout: 'plugin-layout',
          Row: 'plugin-row',
        },
        styles: {
          Filter: {
            backgroundColor: 'blue',
            color: 'white',
            fontSize: '200%',
          }
        }
      }
    };

    return (
      <div>
        <small>Uses styles from plugin unless overridden (filter should be black).</small>
        <Griddle data={fakeData} plugins={[LocalPlugin, stylePlugin]}
          styleConfig={{
            styles: { Filter: { backgroundColor: 'black', fontStyle: 'italic' } }
          }}
        />
      </div>
    );
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
            onMouseEnter={() => console.log('mouse over')}
            onMouseLeave={() => console.log('mouse out')}
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

storiesOf('Bug fixes', module)
  .add('Shared column title', () => {
    return (
      <Griddle data={fakeData} plugins={[LocalPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} title="Same" />
          <ColumnDefinition id="state" order={1} title="Same" />
        </RowDefinition>
      </Griddle>
    );
  })
  .add('Date values converted to null', () => {
    interface DateData {
        _id: number,
        foo: string,
        date: Date,
        bar: string,
    }

    type Griddle = new () => GenericGriddle<DateData>;
    const Griddle = GenericGriddle as Griddle;

    const dateData = [
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
    return (
      <Griddle data={dateData} plugins={[LocalPlugin]}>
        <RowDefinition>
          <ColumnDefinition id={'_id'} title="ID" />
          <ColumnDefinition id={'foo'} title="Foo" />
          <ColumnDefinition id={'date'} title="Date" type="date" />
          <ColumnDefinition id={'bar'} title="Bar" />
        </RowDefinition>
      </Griddle>
    );
  })
  .add('Delete row', () => {
     const enhanceWithOnClick = onClick => class ComputeThing extends React.Component<any, any> {
      static propTypes = {
        rowData: PropTypes.object.isRequired,
      }

      localClick = () => {
        const { id } = this.props.rowData;

        onClick(id);
      }

      render() {
        const { rowData: { id } } = this.props;

        return (
          <button type='button' onClick={this.localClick}>
            Remove {id}
          </button>
        )
       }
     }


    class SomeComponent extends React.Component<{}, {data: FakeData[]}> {
      private Component;

      constructor(props) {
        super(props);

        this.state = {
           data: [
            {
              "id": 0,
              "name": "Mayer Leonard",
              "country": "United Kingdom",
              "city": "Kapowsin",
              "state": "Hawaii",
              "company": "Ovolo",
              "favoriteNumber": 7
            },
            {
              "id": 1,
              "name": "Koch Becker",
              "city": "Johnsonburg",
              "state": "New Jersey",
              "country": "Madagascar",
              "company": "Eventage",
              "favoriteNumber": 2
            },
            {
              "id": 2,
              "name": "Lowery Hopkins",
              "city": "Blanco",
              "state": "Arizona",
              "country": "Ukraine",
              "company": "Comtext",
              "favoriteNumber": 3
            },
            {
              "id": 3,
              "name": "Walters Mays",
              "city": "Glendale",
              "state": "Illinois",
              "country": "New Zealand",
              "company": "Corporana",
              "favoriteNumber": 6
            },
            {
              "id": 4,
              "name": "Shaw Lowe",
              "city": "Coultervillle",
              "state": "Wyoming",
              "country": "Ecuador",
              "company": "Isologica",
              "favoriteNumber": 2
            },
            {
              "id": 5,
              "name": "Ola Fernandez",
              "city": "Deltaville",
              "state": "Delaware",
              "country": "Virgin Islands (US)",
              "company": "Pawnagra",
              "favoriteNumber": 7
            },
          ]
        }

        this.Component = EnhanceWithRowData(enhanceWithOnClick(this.onRemove));

      }

      onRemove = (rowId) => {
        const newData = this.state.data.filter(x => x.id !== rowId);
        this.setState({data: newData});
      }

      render() {
        return (
          <Griddle data={this.state.data} plugins={[LocalPlugin]}>
            <RowDefinition>
              <ColumnDefinition id="id" />
              <ColumnDefinition id="name" />
              <ColumnDefinition id="somethingTotallyMadeUp" title="Compute thing" customComponent={this.Component} />
            </RowDefinition>
          </Griddle>
        );
       }
     }

    return (
      <SomeComponent />
    );
})

storiesOf('Row', module)
  .add('base row', () => {
    const columnIds = [ 1, 2, 3 ];

    return (
      <table>
        <tbody>
          <Row
            Cell={({columnId}) => <td>Cell {columnId}</td>}
            columnIds={columnIds}
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
              onMouseEnter={() => console.log('mouse over')}
              onMouseLeave={() => console.log('mouse out')}
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
    const noResults = props => (
      <p>Nothing!</p>
    );

    return (
      <Table
        NoResults={noResults}
      />
    );
  })

  .add('empty with columns', () => {
    const components = {
      Table: ({ TableHeading, TableBody, NoResults, style, visibleRows }) => (
        <table style={style}>
          <TableHeading />
          { visibleRows ? (TableBody && <TableBody />) : (NoResults && <NoResults />) }
        </table>
      ),
      NoResultsContainer: compose(
        getContext({
          components: PropTypes.object,
        }),
        connect(
          state => ({
            columnIds: selectors.columnIdsSelector(state),
            style: selectors.stylesForComponentSelector(state, 'NoResults'),
          })
        ),
        mapProps(props => ({
          NoResults: props.components.NoResults,
          ...props
        }))
      ),
      NoResults: ({ columnIds, style }) => (
        <tr style={style}>
          <td colSpan={columnIds.length}>Nothing!</td>
        </tr>
      ),
    };
    const styleConfig = {
      styles: {
        NoResults: {
          backgroundColor: "#eee",
          textAlign: "center",
        },
        Table: {
          width: "80%",
        },
      },
    };

    return (
      <Griddle components={components} styleConfig={styleConfig}>
        <RowDefinition>
          <ColumnDefinition id="name" order={2} />
          <ColumnDefinition id="state" order={1} />
        </RowDefinition>
      </Griddle>
    );
  })

  .add('base table with visibleRows', () => {
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
        visibleRows={1}
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

    class BaseWithContext extends React.Component<any> {
      static childContextTypes = {
        components: PropTypes.object.isRequired
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

storiesOf('SettingsWrapper', module)
  .add('base disabled', () => {
    return (
      <SettingsWrapper />
    );
  })
  .add('base enabled not visible', () => {
    const toggle = (props) => <div>Toggle!</div>;
    return (
      <SettingsWrapper isEnabled={true} SettingsToggle={toggle} />
    );
  })
  .add('base enabled and visible', () => {
    const settings = (props) => <div>Settings!</div>;
    return (
      <SettingsWrapper isEnabled={true} isVisible={true} Settings={settings} />
    );
  })

storiesOf('SettingsToggle', module)
  .add('base', () => {
    const onClick = () => console.log('toggle');
    return (
      <SettingsToggle onClick={onClick} text={"Toggle!"} />
    );
  })

storiesOf('Settings', module)
  .add('base', () => {
    const components = [1,2,3].map((n, i) => (props) => <div>Settings {n}</div>);
    return (
      <Settings settingsComponents={components} />
    );
  })
  .add('remove built-in settings', () => {
    const plugin = {
      components: {
        SettingsComponents: null,
      },
      settingsComponentObjects: {
        fancy: { order: 1, component: () => <div>Fancy Settings Component</div> },
      },
    }
    return (
      <Griddle data={fakeData} plugins={[LocalPlugin,plugin]} />
    );
  })
  .add('reorder built-in settings', () => {
    const settingsComponentObjects = {
      before: { order: 1, component: () => <div>Before</div> },
      columnChooser: { order: 2 },
      between: { order: 3, component: () => <div>Between</div> },
      pageSizeSettings: { order: 4 },
      after: { order: 5, component: () => <div>After</div> },
    };
    return (
      <Griddle data={fakeData} plugins={[LocalPlugin]} settingsComponentObjects={settingsComponentObjects} />
    );
  })

  .add('custom column chooser', () => {
    const columnChooser =
      compose(
        connect(
          (state) => ({
            columns: createSelector(
              selectors.sortedColumnPropertiesSelector,
              colMap => {
                const columns = colMap.valueSeq().toJS();
                return columns.filter(c => !c.isMetadata);
              }
            )(state),
          }),
          {
            toggleColumn: actions.toggleColumn
          }
        ),
        withHandlers({
          onToggle: ({toggleColumn}) => event => {
            toggleColumn(event.target.name)
          }
        })
      )(({ columns, onToggle }) => {
      return (
        <div>
          { Object.keys(columns).map(c =>
            <label key={columns[c].id}>
              <input
                type="checkbox"
                name={columns[c].id}
                defaultChecked={columns[c].visible !== false}
                onChange={onToggle}
              />
              {columns[c].title || columns[c].id}
            </label>
          )}
        </div>
      )});

    const SimpleColumnChooserPlugin = {
      components:{
        SettingsComponents: {
          columnChooser,
        },
      },
    };

    return (
      <Griddle data={fakeData} plugins={[LocalPlugin,SimpleColumnChooserPlugin]} settingsComponentObjects={{ pageSizeSettings: null }}>
        <RowDefinition>
          <ColumnDefinition id="name" />
          <ColumnDefinition id="company" />
          <ColumnDefinition id="state" />
          <ColumnDefinition id="country" visible={false} />
        </RowDefinition>
      </Griddle>
    );
  })

  .add('custom page size settings', () => {
    const pageSizeSettings = ({ pageSizes }) =>
      compose(
        connect(
          (state) => ({
            pageSize: selectors.pageSizeSelector(state),
          }),
          {
            setPageSize: actions.setPageSize
          }
        ),
        withHandlers({
          onChange: props => e => {
            props.setPageSize(+e.target.value);
          },
        }),
      )(({ pageSize, onChange }) => {
      return (
        <div>
          <select onChange={onChange} defaultValue={pageSize}>
            { pageSizes.map(s => <option key={s}>{s}</option>) }
          </select>
        </div>
      )});

    const PageSizeDropDownPlugin = (config) => ({
      components: {
        SettingsComponents: {
          pageSizeSettings: pageSizeSettings(config),
        },
      },
    });

    const pluginConfig = {
      pageSizes: [5, 10, 20, 50],
    };
    return (
      <Griddle data={fakeData} plugins={[LocalPlugin,PageSizeDropDownPlugin(pluginConfig)]} settingsComponentObjects={{ columnChooser: null }} />
    );
  })

  .add('relocate page size setting near pagination', () => {
    const PageSizeSettings = components.SettingsComponents.pageSizeSettings;

    const PageSizeDropDownInPaginationPlugin = {
      components: {
        Pagination: ({ Next, Previous, PageDropdown }) => (
          <div>
            <PageSizeSettings />
            {Previous && <Previous />}
            {PageDropdown && <PageDropdown /> }
            {Next && <Next /> }
          </div>
        ),
      },
    };

    return (
      <Griddle
        data={fakeData}
        plugins={[LocalPlugin,PageSizeDropDownInPaginationPlugin]}
        settingsComponentObjects={{
          pageSizeSettings: null
        }} />
    );
  })

storiesOf('TypeScript', module)
  .add('GriddleComponent accepts expected types', () => {
    class Custom extends React.Component<{ value }> {
      render() {
        return this.props.value;
      }
    }

    return (
      <Griddle data={fakeData} plugins={[LocalPlugin]}>
        <RowDefinition>
          <ColumnDefinition id="name" customComponent={({ value }) => <em>{value}</em>} />
          <ColumnDefinition id="state" customComponent={Custom} />
        </RowDefinition>
      </Griddle>
    );
  })
