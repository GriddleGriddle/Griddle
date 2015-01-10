/** @jsx React.DOM */
jest.dontMock('../gridRow.jsx');

var React = require('react/addons');
var GridRow = require('../gridRow.jsx');
var TestUtils = React.addons.TestUtils;

describe('GridRow', function(){
	var row, row2;
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

	  var fakeSubgridData =  [
	  {
	    "id": 0,
	    "name": "Mayer Leonard",
	    "city": "Kapowsin",
	    "state": "Hawaii",
	    "country": "United Kingdom",
	    "company": "Ovolo",
	    "favoriteNumber": 7,
	    "children": [
	        {
	          "id": 273,
	          "name": "Hull Wade",
	          "city": "Monument",
	          "state": "Nebraska",
	          "country": "Cyprus",
	          "company": "Indexia",
	          "favoriteNumber": 10,
	          "children":[
	            {
	              "id": 5,
	              "name": "Ola Fernandez",
	              "city": "Deltaville",
	              "state": "Delaware",
	              "country": "Virgin Islands (US)",
	              "company": "Pawnagra",
	              "favoriteNumber": 7
	            },
	            {
	              "id": 6,
	              "name": "Park Carr",
	              "city": "Welda",
	              "state": "Kentucky",
	              "country": "Sri Lanka",
	              "company": "Cosmetex",
	              "favoriteNumber": 7
	            },
	            {
	              "id": 7,
	              "name": "Laverne Johnson",
	              "city": "Rosburg",
	              "state": "New Mexico",
	              "country": "Croatia",
	              "company": "Housedown",
	              "favoriteNumber": 9
	            }
	          ]
	        },
	        {
	          "id": 274,
	          "name": "Blanca Sheppard",
	          "city": "Wadsworth",
	          "state": "West Virginia",
	          "country": "Nicaragua",
	          "company": "Gogol",
	          "favoriteNumber": 7
	        },
	        {
	          "id": 275,
	          "name": "Stella Luna",
	          "city": "Dubois",
	          "state": "Oregon",
	          "country": "Czech Republic",
	          "company": "Intrawear",
	          "favoriteNumber": 1
	        }
	    ]
	  },
	  {
	    "id": 1,
	    "name": "Koch Becker",
	    "city": "Johnsonburg",
	    "state": "New Jersey",
	    "country": "Madagascar",
	    "company": "Eventage",
	    "favoriteNumber": 2,
	    "children": [
	        {
	          "id": 273,
	          "name": "Hull Wade",
	          "city": "Monument",
	          "state": "Nebraska",
	          "country": "Cyprus",
	          "company": "Indexia",
	          "favoriteNumber": 10
	        },
	        {
	          "id": 274,
	          "name": "Blanca Sheppard",
	          "city": "Wadsworth",
	          "state": "West Virginia",
	          "country": "Nicaragua",
	          "company": "Gogol",
	          "favoriteNumber": 7
	        },
	        {
	          "id": 275,
	          "name": "Stella Luna",
	          "city": "Dubois",
	          "state": "Oregon",
	          "country": "Czech Republic",
	          "company": "Intrawear",
	          "favoriteNumber": 1
	        }
	    ]
	  },
	  {
	    "id": 2,
	    "name": "Lowery Hopkins",
	    "city": "Blanco",
	    "state": "Arizona",
	    "country": "Ukraine",
	    "company": "Comtext",
	    "favoriteNumber": 3,
	     "children": [
	        {
	          "id": 273,
	          "name": "Hull Wade",
	          "city": "Monument",
	          "state": "Nebraska",
	          "country": "Cyprus",
	          "company": "Indexia",
	          "favoriteNumber": 10
	        },
	        {
	          "id": 274,
	          "name": "Blanca Sheppard",
	          "city": "Wadsworth",
	          "state": "West Virginia",
	          "country": "Nicaragua",
	          "company": "Gogol",
	          "favoriteNumber": 7
	        },
	        {
	          "id": 275,
	          "name": "Stella Luna",
	          "city": "Dubois",
	          "state": "Oregon",
	          "country": "Czech Republic",
	          "company": "Intrawear",
	          "favoriteNumber": 1
	        }
	    ]
	  }];

	  row = TestUtils.renderIntoDocument(<GridRow data={fakeData}/>);
	  row2 = TestUtils.renderIntoDocument(<GridRow data={fakeSubgridData} hasChildren={true}/>);
	});

	it('does not call toggleChildren if no child rows are specified', function(){
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

		expect(mock.mock.calls.length).toEqual(0);
	})


	it('calls toggleChildren if child rows are specified', function(){
	  expect(TestUtils.isCompositeComponent(row2)).toBe(true);
		var mock = jest.genMockFunction();
		row2.props.toggleChildren = mock;

		expect(mock.mock.calls.length).toEqual(0);
		var tr = TestUtils.findRenderedDOMComponentWithTag(row2, 'tr');
		expect(tr.length).not.toBe(null);
		var td = TestUtils.scryRenderedDOMComponentsWithTag(tr, 'td');

		expect(td.length).toBeGreaterThan(0);
		var first = td[0];

		React.addons.TestUtils.Simulate.click(first);

		expect(mock.mock.calls.length).toEqual(1);
	})
});
