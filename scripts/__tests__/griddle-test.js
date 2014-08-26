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

    grid = TestUtils.renderIntoDocument(<Griddle results={fakeData} />);
  });


  it('gets added to the dom', function(){
    expect(TestUtils.isDOMComponent(grid));
    expect(TestUtils.isDescriptorOfType(grid), Griddle);
  });

  it('gets the right data on load', function() {
    expect(grid.state.results).toBe(fakeData); 
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

});
