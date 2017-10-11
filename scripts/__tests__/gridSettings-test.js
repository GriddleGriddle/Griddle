var React = require('react');
var createReactClass = require('create-react-class');
var GridSettings = require('../gridSettings.jsx');
var TestUtils = require('react-addons-test-utils');

describe('GridSettings', function() {

	it('calls method when page sizing', function(){
		var columns = ["one", "two", "three"];
		var mock = jasmine.createSpy();
		var settings = TestUtils.renderIntoDocument(<GridSettings columns={columns} setPageSize={mock} />);

		var someEvent = {
			"target":{
				"value":3
			}
		};

		settings.setPageSize(someEvent); 
		expect(mock.calls.argsFor(0)).toEqual([3]);
	});
});
