/** @jsx React.DOM */
jest.dontMock('../gridSettings.jsx');

var React = require('react/addons');
var GridSettings = require('../gridSettings.jsx');
var TestUtils = React.addons.TestUtils;

describe('GridSettings', function() {
	var settings;

	beforeEach(function(){
		columns = ["one", "two", "three"];
	    settings = TestUtils.renderIntoDocument(<GridSettings columns={columns} />);
	});

	it('calls method when page sizing', function(){
		var mock = jest.genMockFunction();

		settings.props.setPageSize = mock; 

		var someEvent = {
			"target":{
				"value":3
			}
		};

		settings.setPageSize(someEvent); 
		expect(mock.mock.calls).toEqual([[3]]);
	});
});