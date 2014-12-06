/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');

var CustomFormatContainer = React.createClass({
  getDefaultProps: function(){
    return{
      "data": [],
      "metadataColumns": [],
      "className": "",
      "customFormat": {}
    }
  },
  render: function() {
    var that = this;

    if (typeof that.props.customFormat !== 'function'){
      console.log("Couldn't find valid template.");
      return (<div className={this.props.className}></div>);
    }

    var nodes = this.props.data.map(function(row, index){
        return <that.props.customFormat data={row} metadataColumns={that.props.metadataColumns} key={index}/>
    });

    return (
      <div className={this.props.className}>
          {nodes}
      </div>
    );
  }
});

module.exports = CustomFormatContainer;
