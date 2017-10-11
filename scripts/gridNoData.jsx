/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var createReactClass = require('create-react-class');

var GridNoData = createReactClass({
    getDefaultProps: function(){
        return {
            "noDataMessage": "No Data"
        }
    },
    render: function(){
        var that = this;

        return(
            <div>{this.props.noDataMessage}</div>
        );
    }
});

module.exports = GridNoData;
