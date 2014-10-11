/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react/addons');
var GridRowContainer = require('./gridRowContainer.jsx');

var GridBody = React.createClass({
  getDefaultProps: function(){
    return{
      "data": [],
      "metadataColumns": [],
      "className": ""
    }
  },
  render: function() {
    var that = this;

    var nodes = this.props.data.map(function(row, index){
        return <GridRowContainer data={row} metadataColumns={that.props.metadataColumns} columnMetadata={that.props.columnMetadata} />
    });

    return (

            <table className={this.props.className}>
                {nodes}
            </table>
        );
    }
});

module.exports = GridBody;
