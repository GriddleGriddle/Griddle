/** @jsx React.DOM */
jest.dontMock('../griddle.jsx');

var React = require('react/addons');
var Griddle = require('../griddle.jsx');
var TestUtils = React.addons.TestUtils;

var SomeCustomComponent = React.createClass({
  render: function(){
    return <h1>Test</h1>
  }
});

describe('Griddle', function() {
  var fakeData;
  var grid;

  var CustomGridComponent = React.createClass({
    getInitialProps: function(){
      return {
        data: []
      }
    },
    render: function(){
      return <div>{this.props.data.length}</div>;
    }
  });

  var expectFakeData = function(grid){
      var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid, 'tr')
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
  }

  beforeEach(function(){
    spyOn(console, 'error');

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

    fakeData2 = [
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

  it('calls external sort function when clicked and useExternal is true', function(){
      var mock = jest.genMockFunction();
      var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
          results={fakeData2}
          useExternal={true}
          externalChangeSort={mock}
          gridClassName="test" />);

      var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'tr')
      var thRow = TestUtils.scryRenderedDOMComponentsWithTag(rows[0], "th");

      TestUtils.Simulate.click(thRow[0].getDOMNode(), {target: {dataset: { title: "Test"}}});
      expect(mock.mock.calls.length).toEqual(1);
  });

  it('does not call external sort function when useExternal is false', function(){
          var mock = jest.genMockFunction();
      var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
          results={fakeData2}
          useExternal={false}
          externalChangeSort={mock}
          gridClassName="test" />);

      var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'tr')
      var thRow = TestUtils.scryRenderedDOMComponentsWithTag(rows[0], "th");

      TestUtils.Simulate.click(thRow[0].getDOMNode(), {target: {dataset: { title: "Test"}}});
      expect(mock.mock.calls.length).toEqual(0);
  });

  it('calls external filter when filter changed and useExternal is true', function(){
      var mock = jest.genMockFunction();
      var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
        useExternal={true} showFilter={true} externalSetFilter={mock} gridClassName="test" />);

      var input = TestUtils.findRenderedDOMComponentWithTag(grid2, "input");
      TestUtils.Simulate.change(input, {target: {value: 'Hi'}});
      expect(mock.mock.calls.length).toEqual(1);
  });

  it('does not call external filter when filter changed and useExternal is false', function(){
    var mock = jest.genMockFunction();
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
      useExternal={false} showFilter={true} externalSetFilter={mock} gridClassName="test" />);

      var input = TestUtils.findRenderedDOMComponentWithTag(grid2, "input");
      TestUtils.Simulate.change(input, {target: {value: 'Hi'}});
      expect(mock.mock.calls.length).toEqual(0);
  });

  //basically if external is true it should never use filteredResults
  it('does not set filtered results when filter changes and external results is true', function(){
      var mock = jest.genMockFunction();
      var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
        useExternal={true} showFilter={true} externalSetFilter={mock} gridClassName="test" />);

      var input = TestUtils.findRenderedDOMComponentWithTag(grid2, "input");
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
      expect(grid2.state.sortColumn).toEqual("");
  });

  it ('uses external sort ascending when useExternal is true', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
      useExternal={true} externalSortAscending={true} gridClassName="test" />);

      expect(grid2.getCurrentSortAscending()).toBe(true);
  });

  it('should log an error if useExternal is true and externalSetPage is not set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
      useExternal={true} gridClassName="test" />);

    expect(console.error).toHaveBeenCalledWith("useExternal is set to true but there is no externalSetPage function specified.");
  });

  it('should not log error with externalSetPage if it is available', function(){
   var mock = jest.genMockFunction();
   var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} externalSetPage={mock} gridClassName="test" />);

   expect(console.error).not.toHaveBeenCalledWith("useExternal is set to true but there is no externalSetPage function specified."); 
  }); 

  it('should log an error if useExternal is true and externalChangeSort is not set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
      useExternal={true} gridClassName="test" />);

    expect(console.error).toHaveBeenCalledWith("useExternal is set to true but there is no externalChangeSort function specified.");
  });

  it('should not log error with externalChangeSort if it is available', function(){
   var mock = jest.genMockFunction();
   var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} externalChangeSort={mock} gridClassName="test" />);

   expect(console.error).not.toHaveBeenCalledWith("useExternal is set to true but there is no externalChangeSort function specified."); 
  });

  it('should log an error if useExternal is true and externalSetFilter is not set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
      useExternal={true} gridClassName="test" />);

    expect(console.error).toHaveBeenCalledWith("useExternal is set to true but there is no externalSetFilter function specified.");
  });

  it('should not log error with useExternal if externalSetFilter is available', function(){
   var mock = jest.genMockFunction();
   var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} externalSetFilter={mock} gridClassName="test" />);

   expect(console.error).not.toHaveBeenCalledWith("useExternal is set to true but there is no externalSetFilter function specified."); 
  }); 

  it('should log an error if useExternal is true and externalSetPageSize is not set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
      useExternal={true} gridClassName="test" />);

    expect(console.error).toHaveBeenCalledWith("useExternal is set to true but there is no externalSetPageSize function specified.");
  });

  it('should not log error with externalSetPage if it is available', function(){
   var mock = jest.genMockFunction();
   var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} externalSetPageSize={mock} gridClassName="test" />);

   expect(console.error).not.toHaveBeenCalledWith("useExternal is set to true but there is no externalSetPageSize function specified."); 
  });

  it('should log an error if useExternal is true and externalMaxPage is not set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
      useExternal={true} gridClassName="test" />);

    expect(console.error).toHaveBeenCalledWith("useExternal is set to true but externalMaxPage is not set.");
  });

  it('should not log error with externalMaxPage if it is available', function(){
   var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} externalMaxPage={8} gridClassName="test" />);

   expect(console.error).not.toHaveBeenCalledWith("useExternal is set to true but externalMaxPage is not set."); 
  });

  it('should log an error if useExternal is true and externalCurrentPage is not set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
      useExternal={true} gridClassName="test" />);
    expect(console.error).toHaveBeenCalledWith("useExternal is set to true but externalCurrentPage is not set. Griddle will not page correctly without that property when using external data.");
  });

  it('should not log error with externalCurrentPage if it is available', function(){
   var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useExternal={true} externalCurrentPage={8} gridClassName="test" />);

   expect(console.error).not.toHaveBeenCalledWith("useExternal is set to true but externalCurrentPage is not set. Griddle will not page correctly without that property when using external data."); 
  });

  it('uses custom row component when set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} useCustomRowComponent={true} customRowComponent={SomeCustomComponent} />);

    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'h1');
    expect(rows.length).toBeGreaterThan(0)
  });

  it('doesnt use custom row component when not set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} />);

    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'h1');
    expect(rows.length).toEqual(0);
  });

  it('should throw an error if useCustomRowComponent is true and no component is added', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} useCustomRowComponent={true} />);

    expect(console.error).toHaveBeenCalledWith("useCustomRowComponent is set to true but no custom component was specified."); 
  });

  it('uses custom grid component when set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} useCustomGridComponent={true} customGridComponent={SomeCustomComponent} />);

    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'h1');
    expect(rows.length).toBeGreaterThan(0)
  });

  it('doesnt use custom grid component when not set', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} />);

    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'h1');
    expect(rows.length).toEqual(0);
  });

  it('should throw an error if useCustomGridComponent is true and no component is added', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} useCustomGridComponent={true} />);
    expect(console.error).toHaveBeenCalledWith("useCustomGridComponent is set to true but no custom component was specified."); 
  });

  it('show display a warning if useCustomGridComponent and useCustomRowComponent are both true', function(){
    var mock = jest.genMockFunction();
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} useCustomGridComponent={true} customGridComponent={mock} useCustomRowComponent={true} customRowComponent={mock} />)
  })

 it('should not show filter when useCustomGridComponent is true', function(){
  var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    useCustomGridComponent={true} customGridComponent={CustomGridComponent} gridClassName="test" />);

  var rows = TestUtils.scryRenderedDOMComponentsWithClass(grid2, 'form-control')
  expect(rows.length).toEqual(0);
 });

 it('should show filter when useCustomGridComponent is false', function(){
  var grid2 = TestUtils.renderIntoDocument(<Griddle externalResults={fakeData}
    showFilter={true} gridClassName="test" />);

  var rows = TestUtils.scryRenderedDOMComponentsWithClass(grid2, 'form-control')
  expect(rows.length).toEqual(1);
 });

it('should not show footer when useCustomGridComponent is true', function(){
  var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} gridClassName="test" useCustomGridComponent={true} customGridComponent={CustomGridComponent} />);

  var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'select')
  expect(rows.length).toEqual(0);
});

 it('should show footer when useCustomGridComponent is false', function(){
  var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} gridClassName="test" />);

  var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'select')
  expect(rows.length).toEqual(1);
 });


  it('should give the grid the entire dataset and not use the filtered data', function(){
    var griddle2 = <Griddle results={fakeData} gridClassName="test" resultsPerPage={1}  useCustomGridComponent={true} customGridComponent={CustomGridComponent} />;
    var grid2 = TestUtils.renderIntoDocument(griddle2);

    var component = TestUtils.scryRenderedComponentsWithType(grid2, CustomGridComponent)
    expect(component.length).toEqual(1);

    expect(component[0].props.data.length).toEqual(2);
  });

  it('throws error if useCustomGridComponent and useCustomRowComponent are both true', function(){
    var grid2 = TestUtils.renderIntoDocument(<Griddle results={fakeData} useCustomGridComponent={true} customGridComponent={CustomGridComponent} useCustomRowComponent={true} customRowComponent={CustomGridComponent} />); 
    expect(console.error).toHaveBeenCalledWith("Cannot currently use both customGridComponent and customRowComponent."); 
    
  })
});
