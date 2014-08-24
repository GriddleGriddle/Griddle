/** @jsx React.DOM */
/*jest.dontMock('../griddle.jsx');
jest.dontMock('../gridBody.jsx');
jest.dontMock('../gridFilter.jsx');
jest.dontMock('../gridPagination.jsx');
jest.dontMock('../gridRow.jsx');
jest.dontMock('../gridRowContainer.jsx');*/
jest.dontMock('../griddle.jsx');
//jest.dontMock('../gridTitle.jsx');

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

    var grid = TestUtils.renderIntoDocument(
     <Griddle results={fakeData}/>
    );

//    expect(TestUtils.isComponentOfType(griddle, Griddle)).toBe(true);
  });
});
