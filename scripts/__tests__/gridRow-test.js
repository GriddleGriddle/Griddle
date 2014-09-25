/** @jsx React.DOM */
jest.dontMock('../gridRow.jsx');

var React = require('react/addons');
var GridRow = require('../gridRow.jsx');
var TestUtils = React.addons.TestUtils;

describe('GridRow', function(){
	var row; 
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
	    row = TestUtils.renderIntoDocument(<GridRow data={fakeData}/>);
	});

	it('calls change filter when clicked', function(){
		expect(TestUtils.isCompositeComponent(row)).toBe(true);
		var mock = jest.genMockFunction(); 
		row.props.toggleChildren = mock;

		expect(mock.mock.calls.length).toEqual(0);	
		var tr = TestUtils.findRenderedDOMComponentWithTag(row, 'tr');
		expect(tr.length).not.toBe(null);
		var td = TestUtils.scryRenderedDOMComponentsWithTag(tr, 'td');

		expect(td.length).toBeGreaterThan(0);
		var first = td[0];

		React.addons.TestUtils.Simulate.click(first);	

		expect(mock.mock.calls.length).toEqual(1);
	})
});