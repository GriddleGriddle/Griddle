/** @jsx React.DOM */
jest.dontMock('../gridFilter.jsx');

var React = require('react/addons');
var GridFilter = require('../gridFilter.jsx');
var TestUtils = React.addons.TestUtils;

describe('GridFilter', function(){
    var filter;

    beforeEach(function(){
        filter = TestUtils.renderIntoDocument(<GridFilter />);
    });

    it('has the proper default className applied', function () {
        var component = TestUtils.findRenderedDOMComponentWithTag(filter, 'div');
        expect(component.getDOMNode().className).toEqual('row filter-container');
    });

    it('allows setting of className', function () {
        var filterWithClassName = TestUtils.renderIntoDocument(
            <GridFilter className='my-custom-class' />
        );
        var component = TestUtils.findRenderedDOMComponentWithTag(filterWithClassName, 'div');
        expect(component.getDOMNode().className).toEqual('my-custom-class');
    });

    it('calls change filter when clicked', function(){
        var mock = jest.genMockFunction();
        filter.props.changeFilter = mock;

        var someEvent = {
            "target":{
                "value":"hi"
            }
        };

        var input = TestUtils.findRenderedDOMComponentWithTag(filter, 'input');
        React.addons.TestUtils.Simulate.change(input, someEvent);

        expect(mock.mock.calls).toEqual([["hi"]]);
    })
});
