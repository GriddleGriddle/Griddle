var React = require('react');
var createReactClass = require('create-react-class');
var TestUtils = require('react-addons-test-utils');
var GridFilter = require('../gridFilter.jsx');

describe('GridFilter', function(){

	it('calls change filter when clicked', function(){
		var mock = jasmine.createSpy(); 
		var filter = TestUtils.renderIntoDocument(<GridFilter changeFilter={mock}/>);

		var someEvent = {
			"target":{
				"value":"hi"
			}
		};

		var input = TestUtils.findRenderedDOMComponentWithTag(filter, 'input');		
		TestUtils.Simulate.change(input, someEvent);

		expect(mock.calls.argsFor(0)).toEqual(["hi"]);
	})
});
