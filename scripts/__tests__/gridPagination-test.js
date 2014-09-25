/** @jsx React.DOM */
jest.dontMock('../gridPagination.jsx');

var React = require('react/addons');
var GridPagination = require('../gridPagination.jsx');
var TestUtils = React.addons.TestUtils;

describe('GridPagination', function(){
	var pagination; 
	beforeEach(function(){
	    pagination = TestUtils.renderIntoDocument(<GridPagination />);
	});

	it('calls change filter when clicked', function(){
		var mock = jest.genMockFunction(); 
		pagination.props.setPage = mock;

		var someEvent = {
			"target":{
				"value":3
			}
		};

		var input = TestUtils.findRenderedDOMComponentWithTag(pagination, 'select');		
		React.addons.TestUtils.Simulate.change(input, someEvent);

		expect(mock.mock.calls).toEqual([[2]]);
	})
});