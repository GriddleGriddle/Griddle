jest.dontMock('../gridSettings.jsx');

var React = require('react');
var GridSettings = require('../gridSettings.jsx');
var TestUtils = require('react-addons-test-utils');

describe('GridSettings', function() {

	it('calls method when page sizing', function(){
		var columns = ["one", "two", "three"];
		var mock = jest.genMockFunction();
		var settings = TestUtils.renderIntoDocument(<GridSettings columns={columns} setPageSize={mock} />);

		var someEvent = {
			"target":{
				"value":3
			}
		};

		settings.setPageSize(someEvent); 
		expect(mock.mock.calls).toEqual([[3]]);
	});
});