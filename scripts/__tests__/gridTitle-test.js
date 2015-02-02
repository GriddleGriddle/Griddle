/** @jsx React.DOM */
jest.dontMock('../gridTitle.jsx');

var React = require('react/addons');
var GridTitle = require('../gridTitle.jsx');
var TestUtils = React.addons.TestUtils;

describe('GridTitle', function() {
	var title; 
	var columns; 
	beforeEach(function(){
		columns = ["one", "two", "three"];
	    title = TestUtils.renderIntoDocument(<GridTitle columns={columns} />);
	});

	it('calls method when clicked', function(){
		var node = TestUtils.findRenderedDOMComponentWithTag(title, 'thead');
		var headings = TestUtils.scryRenderedDOMComponentsWithTag(node, 'th');

		var mock = jest.genMockFunction(); 
		title.props.changeSort = mock;

		expect(headings.length).toEqual(3);

		var first = headings[0];
		expect(TestUtils.isDOMComponent(first)).toBe(true);
		expect(title.props.sortColumn).toEqual("");

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
		expect(mock.mock.calls).toEqual([["one"]]);

	});

	it('doesnt sort column where sort is disabled', function(){
		var newMeta = [  {
	    "columnName": "one",
	    "order": 2,
	    "locked": false,
	    "visible": true,
	    "displayName": "Name",
	    "sortable" : false
	  }];

		var title2 = TestUtils.renderIntoDocument(<GridTitle columns={columns} columnMetadata={newMeta} />);

		var node = TestUtils.findRenderedDOMComponentWithTag(title2, 'thead');
		var headings = TestUtils.scryRenderedDOMComponentsWithTag(node, 'th');

		var mock = jest.genMockFunction(); 
		title2.props.changeSort = mock;

		expect(headings.length).toEqual(3);

		var first = headings[0];
		var second = headings[1];

		expect(TestUtils.isDOMComponent(first)).toBe(true);
		expect(TestUtils.isDOMComponent(second)).toBe(true);
		expect(title2.props.sortColumn).toEqual("");

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
		expect(mock.mock.calls).toEqual([["two"]]);
	});
});