/** @jsx React.DOM */
jest.dontMock('../griddle.jsx');

var React = require('react/addons');
var Griddle = require('../griddle.jsx');
var TestUtils = React.addons.TestUtils;

describe('Griddle', function() {
  it('loads', function() {
    var fakeData = [
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

    var grid = <Griddle results={fakeData} />
    grid = TestUtils.renderIntoDocument(grid);

    expect(grid == null).toBe(false);
    expect(grid.state).toEqual({
      maxPage: 1,
      page: 0,
      filteredResults: null,
      filteredColumns: [],
      filter: "",
      sortColumn: "",
      sortAscending: true,
      showColumnChooser: false,
      isLoading: false,
      results: fakeData
    }); 

  });
});
