jest.dontMock('../gridFilter.jsx');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var GridFilter = require('../gridFilter.jsx');

describe('GridFilter', function(){

	it('calls change filter when clicked', function(){
		var mock = jest.genMockFunction(); 
		var filter = TestUtils.renderIntoDocument(<GridFilter changeFilter={mock}/>);

		var someEvent = {
			"target":{
				"value":"hi"
			}
		};

		var input = TestUtils.findRenderedDOMComponentWithTag(filter, 'input');		
		TestUtils.Simulate.change(input, someEvent);

		expect(mock.mock.calls).toEqual([["hi"]]);
	})
});