jest.dontMock('../gridRow.jsx');
jest.dontMock('../columnProperties.js');
jest.dontMock('../rowProperties.js');
jest.dontMock('../deep.js');

var _ = require('underscore'); 
var React = require('react');
var GridRow = require('../gridRow.jsx');
var ColumnProperties = require('../columnProperties.js');
var RowProperties = require('../rowProperties.js');
var TestUtils = require('react-addons-test-utils');

	  var fakeData = [
      {
        "id": 0,
        "name": "Mayer Leonard",
        "address": {
          "city": "Kapowsin",
          "state": "Hawaii"
        },
        "country": "United Kingdom",
        "company": "Ovolo",
        "favoriteNumber": 7
      },
      {
        "id": 1,
        "name": "Koch Becker",
        "address": {
          "city": "Johnsonburg",
          "state": "New Jersey"
        },
        "country": "Madagascar",
        "company": "Eventage",
        "favoriteNumber": 2
      }
    ];

	  var fakeSubgridData =  [
	  {
	    "id": 0,
	    "name": "Mayer Leonard",
      "address": {
        "city": "Kapowsin",
        "state": "Hawaii"
      },
	    "country": "United Kingdom",
	    "company": "Ovolo",
	    "favoriteNumber": 7,
	    "children": [
	        {
	          "id": 273,
	          "name": "Hull Wade",
            "address": {
              "city": "Monument",
              "state": "Nebraska"
            },
	          "country": "Cyprus",
	          "company": "Indexia",
	          "favoriteNumber": 10,
	          "children":[
	            {
	              "id": 5,
	              "name": "Ola Fernandez",
                "address": {
                  "city": "Deltaville",
                  "state": "Delaware"
                },
	              "country": "Virgin Islands (US)",
	              "company": "Pawnagra",
	              "favoriteNumber": 7
	            },
	            {
	              "id": 6,
	              "name": "Park Carr",
                "address": {
                  "city": "Welda",
                  "state": "Kentucky"
                },
	              "country": "Sri Lanka",
	              "company": "Cosmetex",
	              "favoriteNumber": 7
	            },
	            {
	              "id": 7,
	              "name": "Laverne Johnson",
                "address": {
                  "city": "Rosburg",
                  "state": "New Mexico"
                },
	              "country": "Croatia",
	              "company": "Housedown",
	              "favoriteNumber": 9
	            }
	          ]
	        },
	        {
	          "id": 274,
	          "name": "Blanca Sheppard",
            "address": {
              "city": "Wadsworth",
              "state": "West Virginia"
            },
	          "country": "Nicaragua",
	          "company": "Gogol",
	          "favoriteNumber": 7
	        },
	        {
	          "id": 275,
	          "name": "Stella Luna",
            "address": {
              "city": "Dubois",
              "state": "Oregon"
            },
	          "country": "Czech Republic",
	          "company": "Intrawear",
	          "favoriteNumber": 1
	        }
	    ]
	  },
	  {
	    "id": 1,
	    "name": "Koch Becker",
      "address": {
        "city": "Johnsonburg",
        "state": "New Jersey"
      },
	    "country": "Madagascar",
	    "company": "Eventage",
	    "favoriteNumber": 2,
	    "children": [
	        {
	          "id": 273,
	          "name": "Hull Wade",
            "address": {
              "city": "Monument",
              "state": "Nebraska"
            },
	          "country": "Cyprus",
	          "company": "Indexia",
	          "favoriteNumber": 10
	        },
	        {
	          "id": 274,
	          "name": "Blanca Sheppard",
            "address": {
              "city": "Wadsworth",
              "state": "West Virginia"
            },
	          "country": "Nicaragua",
	          "company": "Gogol",
	          "favoriteNumber": 7
	        },
	        {
	          "id": 275,
	          "name": "Stella Luna",
            "address": {
              "city": "Dubois",
              "state": "Oregon"
            },
	          "country": "Czech Republic",
	          "company": "Intrawear",
	          "favoriteNumber": 1
	        }
	    ]
	  },
	  {
	    "id": 2,
	    "name": "Lowery Hopkins",
      "address": {
        "city": "Blanco",
        "state": "Arizona"
      },
	    "country": "Ukraine",
	    "company": "Comtext",
	    "favoriteNumber": 3,
	     "children": [
	        {
	          "id": 273,
	          "name": "Hull Wade",
            "address": {
              "city": "Monument",
              "state": "Nebraska"
            },
	          "country": "Cyprus",
	          "company": "Indexia",
	          "favoriteNumber": 10
	        },
	        {
	          "id": 274,
	          "name": "Blanca Sheppard",
            "address": {
              "city": "Wadsworth",
              "state": "West Virginia"
            },
	          "country": "Nicaragua",
	          "company": "Gogol",
	          "favoriteNumber": 7
	        },
	        {
	          "id": 275,
	          "name": "Stella Luna",
            "address": {
              "city": "Dubois",
              "state": "Oregon"
            },
	          "country": "Czech Republic",
	          "company": "Intrawear",
	          "favoriteNumber": 1
	        }
	    ]
	  }];

describe('GridRow', function(){
	it('does not call toggleChildren if no child rows are specified', function(){
   var columnSettings = new ColumnProperties(
        ['id', 'name', 'address.city', 'address.state', 'country', 'company', 'favoriteNumber'],
        [],
        "children",
        [],
        []
    );
   var rowSettings = new RowProperties();
   var multipleSelectOptions =  {
			isMultipleSelection: false,
			toggleSelectAll: function(){},
			getIsSelectAllChecked: function(){},

			toggleSelectRow: function(){},
			getSelectedRowIds: function(){},
      getIsRowChecked: function(){}
		};

		var mock = jest.genMockFunction();

    const FakeTable = React.createClass({
      render() {
        return (<table>
          <tbody>
            <GridRow data={fakeData[0]}
              toggleChildren={mock}
              columnSettings={columnSettings}
              rowSettings={rowSettings}
              multipleSelectionSettings={multipleSelectOptions} />
          </tbody>
        </table>);
      }
    });

	  var row = TestUtils.renderIntoDocument(<FakeTable />);
		expect(TestUtils.isCompositeComponent(row)).toBe(true);

		expect(mock.mock.calls.length).toEqual(0);
		var tr = TestUtils.findRenderedDOMComponentWithTag(row, 'tr');
		expect(tr.length).not.toBe(null);

		var td = TestUtils.scryRenderedDOMComponentsWithTag(row, 'td');

		expect(td.length).toBeGreaterThan(0);
		var first = td[0];

		TestUtils.Simulate.click(first);

		expect(mock.mock.calls.length).toEqual(0);
	})


	it('calls toggleChildren if child rows are specified', function(){
    var columnSettings = new ColumnProperties(
        ['id', 'name', 'address.city', 'address.state', 'country', 'company', 'favoriteNumber'],
        [],
        "children",
        [],
        []
    );
    var multipleSelectOptions =  {
			isMultipleSelection: false,
			toggleSelectAll: function(){},
			getIsSelectAllChecked: function(){},

			toggleSelectRow: function(){},
			getSelectedRowIds: function(){},
      getIsRowChecked: function(){}
		};

		var mock = jest.genMockFunction();

    const FakeTable = React.createClass({
      render() {
        return (<table>
          <tbody>
            <GridRow data={fakeSubgridData[0]}
              hasChildren={true}
              toggleChildren={mock}
              columnSettings={columnSettings}
              multipleSelectionSettings={multipleSelectOptions}/>
          </tbody>
        </table>);
      }
    });

	  const row2 = TestUtils.renderIntoDocument(<FakeTable />);
	  expect(TestUtils.isCompositeComponent(row2)).toBe(true);

		expect(mock.mock.calls.length).toEqual(0);
		var tr = TestUtils.findRenderedDOMComponentWithTag(row2, 'tr');
		expect(tr.length).not.toBe(null);
		var td = TestUtils.scryRenderedDOMComponentsWithTag(row2, 'td');
		
		expect(td.length).toBeGreaterThan(0);
		var first = td[0];

		TestUtils.Simulate.click(first);

		expect(mock.mock.calls.length).toEqual(1);
	})
});
