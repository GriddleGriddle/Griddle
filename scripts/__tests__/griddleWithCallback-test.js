/** @jsx React.DOM */
jest.dontMock('../griddle.jsx');
jest.dontMock('../griddleWithCallback.jsx');

var React = require('react');
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
});