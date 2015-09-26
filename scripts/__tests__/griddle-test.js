jest.dontMock('../griddle.jsx');
jest.dontMock('../columnProperties.js');
jest.dontMock('../rowProperties.js');
jest.dontMock('../deep.js');

var React = require('react/addons');
var Griddle = require('../griddle.jsx');
var TestUtils = React.addons.TestUtils;

var SomeCustomComponent = React.createClass({
  render: function(){
    return <h1>Test</h1>;
  }
});

describe('Griddle', function() {
  var fakeData;
  var fakeData2;
  var grid;

  var CustomGridComponent = React.createClass({
    getInitialProps: function(){
      return {
        data: []
      };
    },

    render: function(){
      return <div>{this.props.data.length}</div>;
    }
  });

  beforeEach(function(){
    spyOn(console, 'error');

    fakeData = [
      {
        'id': 0,
        'name': 'Mayer Leonard',
        'address': {
          'city': 'Kapowsin',
          'state': 'Hawaii'
        },
        'country': 'United Kingdom',
        'company': 'Ovolo',
        'favoriteNumber': 7
      },
      {
        'id': 1,
        'name': 'Koch Becker',
        'address': {
          'city': 'Johnsonburg',
          'state': 'New Jersey'
        },
        'country': 'Madagascar',
        'company': 'Eventage',
        'favoriteNumber': 2
      }
    ];

    fakeData2 = [
      {
        'id': 0,
        'name': 'Mayer Leonard',
        'address': {
          'city': 'Kapowsin',
          'state': 'Hawaii'
        },
        'country': 'United Kingdom',
        'company': 'Ovolo',
        'favoriteNumber': 7
      },
      {
        'id': 1,
        'name': 'Koch Becker',
        'address': {
          'city': 'Johnsonburg',
          'state': 'New Jersey'
        },
        'country': 'Madagascar',
        'company': 'Eventage',
        'favoriteNumber': 2
      }
    ];

    grid = TestUtils.renderIntoDocument(<Griddle results={fakeData} gridClassName="test" />);
  });


  it('gets added to the dom', function(){
    var griddle = TestUtils.findRenderedDOMComponentWithClass(grid, 'test');
    expect(TestUtils.isDOMComponent(griddle)).toBe(true);
  });

  it('gets the right data on load', function() {
    expect(grid.props.results).toBe(fakeData);
  });

  it('sets the filteredResults when filter is added', function(){
    grid.setFilter('Mayer');
    expect(grid.state.filteredResults.length).toEqual(1);
  });

  it('removes filter when filter is called with empty string', function(){
    grid.setFilter('Mayer');
    grid.setFilter('');
    expect(grid.state.filteredResults).toBe(null);
  });

  //TODO: getExternalResults

  it('sets the page size when a number is passed in to setPageSize', function(){
    grid.setPageSize(25);
    expect(grid.props.resultsPerPage).toEqual(25);
  });

  it('sets the max page when the results property is updated', function(){
    grid.setPageSize(1);
    expect(grid.state.maxPage).toEqual(2);
    var shortFakeData = [fakeData[0]];
    grid.setProps({results: shortFakeData});
    expect(grid.state.maxPage).toEqual(1);
  });

  it('sets column chooser to true property when calling toggle column chooser for first time', function(){
    grid.toggleColumnChooser();
    expect(grid.state.showColumnChooser).toBe(true);
  });

  it('sets column chooser to false when "toggleColumnChooser" is toggled twice', function(){
    grid.toggleColumnChooser();
    grid.toggleColumnChooser();
    expect(grid.state.showColumnChooser).toBe(false);
  });

  it('shows the correct number of pages', function(){
  //we know fake data is two items so it should be one page
    var initial = grid.getMaxPage();
    expect(initial).toEqual(1);

  //this is kind of testing two things at this point :(
    grid.setPageSize(1);
    var other = grid.getMaxPage();
    expect(other).toEqual(2);
  });

  it('starts on page 1', function(){
    expect(0).toEqual(grid.state.page);
  });

  it('gets the right page when change', function(){
    grid.setPageSize(1);
    expect(0).toEqual(grid.state.page);
    grid.setPage(1);
    expect(1).toEqual(grid.state.page);
    grid.setPage(0);
    expect(0).toEqual(grid.state.page);
  });

  it('displays all columns by default', function(){
    var cols = grid.columnSettings.getColumns();
    expect(7).toEqual(cols.length);
    expect(cols[0]).toEqual('id');
    expect(cols[1]).toEqual('name');
    expect(cols[2]).toEqual('address.city');
    expect(cols[3]).toEqual('address.state');
    expect(cols[4]).toEqual('country');
    expect(cols[5]).toEqual('company');
    expect(cols[6]).toEqual('favoriteNumber');
  });

  it('shows only the specified columns', function(){
    var cols = ['id', 'name', 'address.city'];
    grid.setColumns(cols);
    var cols2 = grid.columnSettings.getColumns();
    expect(cols2.length).toEqual(cols.length);
    expect(cols2[0]).toEqual('id');
    expect(cols2[1]).toEqual('name');
    expect(cols2[2]).toEqual('address.city');
  });

  it('sets next page correctly', function(){
    grid.setPageSize(1);
    expect(grid.state.page).toEqual(0);
    grid.nextPage();
    expect(grid.state.page).toEqual(1);
  });

  it('wont go past max pages with next', function(){
    grid.setPageSize(1);
    expect(grid.state.maxPage).toEqual(2);
    expect(grid.state.page).toEqual(0);
    grid.nextPage();
    grid.nextPage();
    expect(grid.state.page).toEqual(1);
  });

  it('sets previous page correctly', function(){
    grid.setPageSize(1);
    expect(grid.state.page).toEqual(0);
    grid.nextPage();
    expect(grid.state.page).toEqual(1);
    grid.previousPage();
    expect(grid.state.page).toEqual(0);
  });

  it('wont go past 0 with previous', function(){
    grid.setPageSize(1);
    expect(grid.state.page).toEqual(0);
    grid.previousPage();
    expect(grid.state.page).toEqual(0);
  });

  it('sets sort filter correctly', function(){
    expect(grid.state.sortColumn).toEqual('');
    grid.changeSort('address.state');
    expect(grid.state.sortColumn).toEqual('address.state');
  });

  it('sets sort direction correctly', function(){
    expect(grid.state.sortColumn).toEqual('');
    grid.changeSort('address.state');
    expect(grid.state.sortColumn).toEqual('address.state');
    expect(grid.state.sortAscending).toEqual(true);
    grid.changeSort('address.state');
    expect(grid.state.sortAscending).toEqual(false);
  });

  it('uses results when external not set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} gridClassName="test" />);
    expect(grid2.props.results).toBe(fakeData);
  });

  it('calls external sort function when clicked and useExternal is true', function(){
    var mock = jest.genMockFunction();
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
      results={fakeData2}
      useExternal={true}
      externalChangeSort={mock}
      gridClassName="test" />);

    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'tr');
    var thRow = TestUtils.scryRenderedDOMComponentsWithTag(rows[0], 'th');

    TestUtils.Simulate.click(thRow[0].getDOMNode(), {target: {dataset: { title: 'Test'}}});
    expect(mock.mock.calls.length).toEqual(1);
  });

  it('does not call external sort function when useExternal is false', function(){
    var mock = jest.genMockFunction();
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
      results={fakeData2}
      useExternal={false}
      externalChangeSort={mock}
      gridClassName="test" />);

    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'tr');
    var thRow = TestUtils.scryRenderedDOMComponentsWithTag(rows[0], 'th');

    TestUtils.Simulate.click(thRow[0].getDOMNode(), {target: {dataset: { title: 'Test'}}});
    expect(mock.mock.calls.length).toEqual(0);
  });

  it('calls external filter when filter changed and useExternal is true', function(){
    var mock = jest.genMockFunction();
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} showFilter={true} externalSetFilter={mock} gridClassName="test" />);

    var input = TestUtils.findRenderedDOMComponentWithTag(grid2, 'input');
    TestUtils.Simulate.change(input, {target: {value: 'Hi'}});
    expect(mock.mock.calls.length).toEqual(1);
  });

  it('does not call external filter when filter changed and useExternal is false', function(){
    var mock = jest.genMockFunction();
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={false} showFilter={true} externalSetFilter={mock} gridClassName="test" />);

    var input = TestUtils.findRenderedDOMComponentWithTag(grid2, 'input');
    TestUtils.Simulate.change(input, {target: {value: 'Hi'}});
    expect(mock.mock.calls.length).toEqual(0);
  });

  //basically if external is true it should never use filteredResults
  it('does not set filtered results when filter changes and external results is true', function(){
    var mock = jest.genMockFunction();
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} showFilter={true} externalSetFilter={mock} gridClassName="test" />);

    var input = TestUtils.findRenderedDOMComponentWithTag(grid2, 'input');
    TestUtils.Simulate.change(input, {target: {value: 'Un'}});
    expect(grid2.state.filteredResults).toBe(null);
  });

  it('calls external set page when page changed and useExternal is true', function(){
    var mock = jest.genMockFunction();
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} showFilter={true} externalSetPage={mock} gridClassName="test" />);

    grid2.setPage(2);
    expect(mock.mock.calls.length).toEqual(1);
  });

  it('calls external set page size when page changed and useExternal is true', function(){
    var mock = jest.genMockFunction();
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} showFilter={true} externalSetPageSize={mock} gridClassName="test" />);

    grid2.setPageSize(2);
    expect(mock.mock.calls.length).toEqual(1);
  });

  it('uses external max pages when useExternal is true', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} externalMaxPage={8} gridClassName="test" />);

    expect(grid2.getCurrentMaxPage()).toEqual(8);
    expect(grid2.state.maxPage).toEqual(8);
  });

  it('uses external current page when useExternal is true', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} externalCurrentPage={8} gridClassName="test" />);

    expect(grid2.getCurrentPage()).toEqual(8);
  });

  it('uses external sort column when useExternal is true', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} externalSortColumn={'name'} gridClassName="test" />);

    expect(grid2.getCurrentSort()).toEqual('name');
    expect(grid2.state.sortColumn).toEqual('');
  });

  it ('uses external sort ascending when useExternal is true', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} externalSortAscending={true} gridClassName="test" />);

    expect(grid2.getCurrentSortAscending()).toBe(true);
  });

  it('uses custom row component when set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} useCustomRowComponent={true} customRowComponent={SomeCustomComponent} />);

    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'h1');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('doesnt use custom row component when not set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} />);

    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'h1');
    expect(rows.length).toEqual(0);
  });

  it('uses custom grid component when set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} useCustomGridComponent={true} customGridComponent={SomeCustomComponent} />);

    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'h1');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('doesnt use custom grid component when not set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} />);

    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'h1');
    expect(rows.length).toEqual(0);
  });

  it('should not show filter when useCustomGridComponent is true', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useCustomGridComponent={true} customGridComponent={CustomGridComponent} gridClassName="test" />);

    var rows = TestUtils.scryRenderedDOMComponentsWithClass(grid2, 'form-control');
    expect(rows.length).toEqual(0);
  });

  it('should show filter when useCustomGridComponent is false', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    showFilter={true} gridClassName="test" />);

    var rows = TestUtils.scryRenderedDOMComponentsWithClass(grid2, 'form-control');
    expect(rows.length).toEqual(1);
  });

  it('should not show footer when useCustomGridComponent is true', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} gridClassName="test" useCustomGridComponent={true} customGridComponent={CustomGridComponent} />);

    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'select');
    expect(rows.length).toEqual(0);
  });

  it('should show footer when useCustomGridComponent is false', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} gridClassName="test" />);
    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'select');

    expect(rows.length).toEqual(1);
  });

  it('should give the grid the entire dataset and not use the filtered data', function(){
    var griddle2 = <Griddle results={fakeData} gridClassName="test" resultsPerPage={1}  useCustomGridComponent={true} customGridComponent={CustomGridComponent} />;
    var grid2 = TestUtils.renderIntoDocument(griddle2);

    var component = TestUtils.scryRenderedComponentsWithType(grid2, CustomGridComponent);
    expect(component.length).toEqual(1);

    expect(component[0].props.data.length).toEqual(2);
  });

  it('should call the onRowClick callback when clicking a row', function () {
    var clicked = false;
    var onRowClick = function(){
      clicked = true;
    };

    var grid2 = TestUtils.renderIntoDocument(
      <Griddle results={fakeData}
        gridClassName="test"
        resultsPerPage={1}
        onRowClick={onRowClick} />
    );

    var cells = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'td');
    TestUtils.Simulate.click(cells[0].getDOMNode());
    expect(clicked).toEqual(true);
  });
});
