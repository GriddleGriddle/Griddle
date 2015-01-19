/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');

var GridFilter = React.createClass({
    getDefaultProps: function(){
      return {
        "placeholderText": ""
      }
    },
    handleChange: function(event){
        this.props.changeFilter(event.target.value);
    },
    render: function(){
        return <div className="row filter-container"><input type="text" name="filter" placeholder={this.props.placeholderText} className="form-control" onChange={this.handleChange} /></div>
    }
});

module.exports = GridFilter;
