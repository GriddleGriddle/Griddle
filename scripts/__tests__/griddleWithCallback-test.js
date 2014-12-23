/** @jsx React.DOM */
jest.dontMock('../griddle.jsx');
jest.dontMock('../griddleWithCallback.jsx');

var React = require('react/addons');
var Griddle = require('../griddle.jsx');
var GriddleWithCallback = require('../griddleWithCallback.jsx');
var TestUtils = React.addons.TestUtils;

describe('griddleWithCallback', function(){
	var fakeData; 
	var grid; 

	beforeEach(function(){
		spyOn(console, 'error');
	});

	it('throws an error if external data is not present', function(){
	   var mock = jest.genMockFunction();
	   var grid2 = TestUtils.renderIntoDocument(<GriddleWithCallback />);

	   expect(console.error).toHaveBeenCalledWith("When using GriddleWithCallback, a getExternalResults callback must be supplied."); 
	});

	it('does not throws an error if external data is present', function(){
	   var mock = jest.genMockFunction();
	   var grid2 = TestUtils.renderIntoDocument(<GriddleWithCallback getExternalResults={mock} />);

	   expect(console.error).not.toHaveBeenCalledWith("When using GriddleWithCallback, a getExternalResults callback must be supplied."); 
	});

	it('passes props with the spread operator if not defined on props of griddleWithCallback', function(){
		var mock = jest.genMockFunction();
	    var grid2 = TestUtils.renderIntoDocument(<GriddleWithCallback getExternalResults={mock} />);

	    // check that the showPager is undefined and the pager is there
	    expect(typeof grid2.props.showPager === 'undefined');

	    var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid2, 'select')
		expect(rows.length).toEqual(1);

	    var grid3 = TestUtils.renderIntoDocument(<GriddleWithCallback showPager={false} getExternalResults={mock} />);

	    //pager should not be rendered now.
		var rows = TestUtils.scryRenderedDOMComponentsWithTag(grid3, 'select')
		expect(rows.length).toEqual(0);
	})
});