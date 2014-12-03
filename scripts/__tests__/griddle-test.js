/** @jsx React.DOM */
jest.dontMock('../griddle.jsx');

var React = require('react/addons');
var Griddle = require('../griddle.jsx');
var TestUtils = React.addons.TestUtils;

describe('Griddle', function() {
  var fakeData;
  var grid;

  beforeEach(function(){
    fakeData = [
      {
        "id": 0,
        "name": "Mayer Leonard",
        "city": "Kapowsin",
        "state": "Hawaii",
        "country": "United Kingdom",
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
    other = grid.getMaxPage();
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
    var cols = grid.getColumns();
    expect(7).toEqual(cols.length);
    expect(cols[0]).toEqual('id');
    expect(cols[1]).toEqual('name');
    expect(cols[2]).toEqual('city');
    expect(cols[3]).toEqual('state');
    expect(cols[4]).toEqual('country');
    expect(cols[5]).toEqual('company');
    expect(cols[6]).toEqual('favoriteNumber');
  });

  it('shows only the specified columns', function(){
    var cols = ["id", "name", "city"];
    grid.setColumns(cols);
    var cols2 = grid.getColumns();
    expect(cols2.length).toEqual(cols.length);
    expect(cols2[0]).toEqual('id');
    expect(cols2[1]).toEqual('name');
    expect(cols2[2]).toEqual('city');
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
    grid.previousPage()
    expect(grid.state.page).toEqual(0);
  });

  it('wont go past 0 with previous', function(){
    grid.setPageSize(1);
    expect(grid.state.page).toEqual(0);
    grid.previousPage();
    expect(grid.state.page).toEqual(0);
  });

  it('sets sort filter correctly', function(){
    expect(grid.state.sortColumn).toEqual("");
    grid.changeSort("name");
    expect(grid.state.sortColumn).toEqual("name");
  });

  it('sets sort direction correctly', function(){
    expect(grid.state.sortColumn).toEqual("");
    grid.changeSort("name");
    expect(grid.state.sortColumn).toEqual("name");
    expect(grid.state.sortAscending).toEqual(true);
    grid.changeSort("name");
    expect(grid.state.sortAscending).toEqual(false);
  });

  it('uses results when external not set', function(){
      grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} gridClassName="test" />);
      expect(grid2.props.results).toBe(fakeData);
  });

  it('uses externalResults when set', function(){
    grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData} useExternal={true} gridClassName="test" />);
    expect(grid2.props.externalResults).toBe(fakeData);
    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'tr')
    expect(rows.length).toEqual(3);

    //maybe overkill
    var thRow = TestUtils.scryRenderedDOMComponentsWithTag(rows[0], "th");
    expect(thRow[0].getDOMNode().textContent).toBe("id");
    expect(thRow[1].getDOMNode().textContent).toBe("name");
    expect(thRow[2].getDOMNode().textContent).toBe("city");
    expect(thRow[3].getDOMNode().textContent).toBe("state");
    expect(thRow[4].getDOMNode().textContent).toBe("country");
    expect(thRow[5].getDOMNode().textContent).toBe("company");
    expect(thRow[6].getDOMNode().textContent).toBe("favoriteNumber");

    var firstRow = TestUtils.scryRenderedDOMComponentsWithTag(rows[1], "td");
    expect(firstRow[0].getDOMNode().textContent).toBe("0");
    expect(firstRow[1].getDOMNode().textContent).toBe("Mayer Leonard");
    expect(firstRow[2].getDOMNode().textContent).toBe("Kapowsin");
    expect(firstRow[3].getDOMNode().textContent).toBe("Hawaii");
    expect(firstRow[4].getDOMNode().textContent).toBe("United Kingdom");
    expect(firstRow[5].getDOMNode().textContent).toBe("Ovolo");
    expect(firstRow[6].getDOMNode().textContent).toBe("7");

    var secondRow = TestUtils.scryRenderedDOMComponentsWithTag(rows[2], "td");
    expect(secondRow[0].getDOMNode().textContent).toBe("1");
    expect(secondRow[1].getDOMNode().textContent).toBe("Koch Becker");
    expect(secondRow[2].getDOMNode().textContent).toBe("Johnsonburg");
    expect(secondRow[3].getDOMNode().textContent).toBe("New Jersey");
    expect(secondRow[4].getDOMNode().textContent).toBe("Madagascar");
    expect(secondRow[5].getDOMNode().textContent).toBe("Eventage");
    expect(secondRow[6].getDOMNode().textContent).toBe("2");
  });
});
