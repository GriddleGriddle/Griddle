/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');

var GridNoData = React.createClass({
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
