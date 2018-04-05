var React = require('react');
var createReactClass = require('create-react-class');
var GridPagination = require('../gridPagination.jsx');
var TestUtils = require('react-addons-test-utils');

describe('GridPagination', function(){
	it('calls change filter when clicked', function(){
		var mock = jasmine.createSpy(); 
		var pagination = TestUtils.renderIntoDocument(<GridPagination setPage={mock}/>);

		var someEvent = {
			"target":{
				"value":3
			}
		};

		var input = TestUtils.findRenderedDOMComponentWithTag(pagination, 'select');		
		TestUtils.Simulate.change(input, someEvent);

		expect(mock.calls.argsFor(0)).toEqual([2]);
	})
});
