/** @jsx React.DOM */
jest.dontMock('../gridTitle.jsx');
jest.dontMock('../columnProperties.js');

var React = require('react/addons');
var GridTitle = require('../gridTitle.jsx');
var TestUtils = React.addons.TestUtils;
var ColumnProperties = require('../columnProperties.js');

describe('GridTitle', function() {
	var title;
	var columns;
	var columnSettings;
	var sortObject;
	var multipleSelectOptions;

	beforeEach(function(){
		columns = ["one", "two", "three"];
		columnSettings = new ColumnProperties(columns, [], "children", [], []);
    sortObject =  {
        enableSort: true,
        changeSort: null,
        sortColumn: "",
        sortAscending: true,
				sortDefaultComponent: null,
        sortAscendingClassName: "",
        sortDescendingClassName: "",
        sortAscendingComponent: null,
        sortDescendingComponent: null
    };
    multipleSelectSettings = {
			isMultipleSelection: false,
			toggleSelectAll: function(){},
			getIsSelectAllChecked: function(){},

			toggleSelectRow: function(){},
			getSelectedRowIds: function(){},
      getIsRowChecked: function(){}
		};

    title = TestUtils.renderIntoDocument(<GridTitle columns={columns} columnSettings={columnSettings} sortSettings={sortObject} multipleSelectionSettings={multipleSelectSettings} />);
	});

	it('calls sortDefaultComponent in table init', function(){
		sortObject['sortDefaultComponent'] = 'UPDOWN';
		//re-call it again with sortDefaultComponent
		title = TestUtils.renderIntoDocument(<GridTitle columns={columns} columnSettings={columnSettings} sortSettings={sortObject} multipleSelectionSettings={multipleSelectSettings} />);

		var node = TestUtils.findRenderedDOMComponentWithTag(title, 'thead');
		var headings = TestUtils.scryRenderedDOMComponentsWithTag(node, 'th');
		expect(headings.length).toEqual(3);
		for(var i = 0, l = headings.length; i < l; i++) {
			var heading = headings[i];
			expect(heading.props.children[1]).toEqual(sortObject['sortDefaultComponent']);
		}

	});

	it('calls method when clicked', function(){
		var node = TestUtils.findRenderedDOMComponentWithTag(title, 'thead');
		var headings = TestUtils.scryRenderedDOMComponentsWithTag(node, 'th');

		var mock = jest.genMockFunction();
		title.props.sortSettings.changeSort = mock;

		expect(headings.length).toEqual(3);

		var first = headings[0];
		expect(TestUtils.isDOMComponent(first)).toBe(true);
		expect(title.props.sortSettings.sortColumn).toEqual("");

		//todo: can we just get this from jsdom?
		var someEvent = {
			"target":{
				"dataset":{
					"title": "one"
				}
			}
		};
		React.addons.TestUtils.Simulate.click(first, someEvent);

    expect(mock.mock.calls.length).toEqual(1);
		expect(mock.mock.calls[0]).toEqual({0: 'one'});

	});

	it('doesnt sort column where sort is disabled', function(){
		var newMeta = [{
	    "columnName": "one",
	    "order": 2,
	    "locked": false,
	    "visible": true,
	    "displayName": "Name",
	    "sortable" : false
	  }];
		var columnSettings2 = new ColumnProperties(columns, [], "children", newMeta, []);

		var title2 = TestUtils.renderIntoDocument(<GridTitle columns={columns} columnSettings={columnSettings2} sortSettings={sortObject} multipleSelectionSettings={multipleSelectSettings} />);

		var node = TestUtils.findRenderedDOMComponentWithTag(title2, 'thead');
		var headings = TestUtils.scryRenderedDOMComponentsWithTag(node, 'th');

		var mock = jest.genMockFunction();
		title2.props.sortSettings.changeSort = mock;

		expect(headings.length).toEqual(3);

		var first = headings[0];
		var second = headings[1];

		expect(TestUtils.isDOMComponent(first)).toBe(true);
		expect(TestUtils.isDOMComponent(second)).toBe(true);
		expect(title2.props.sortSettings.sortColumn).toEqual("");

		//todo: can we just get this from jsdom?
		var someEvent = {
			"target":{
				"dataset":{
					"title": "one"
				}
			}
		};

		var otherEvent = {
			"target":{
				"dataset":{
					"title": "two"
				}
			}
		};
		React.addons.TestUtils.Simulate.click(first, someEvent);

    expect(mock.mock.calls.length).toEqual(0);

		React.addons.TestUtils.Simulate.click(second, otherEvent);
		expect(mock.mock.calls.length).toEqual(1);
		expect(mock.mock.calls[0]).toEqual({0:"two"});
	});
});
