/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');

var CustomPaginationContainer = React.createClass({
  getDefaultProps: function(){
    return{
      "maxPage": 0,
      "nextText": "",
      "previousText": "",
      "currentPage": 0,
      "customPagerComponent": {},
      "customPagerComponentOptions": {}
    }
  },
  render: function() {
    var that = this;

    if (typeof that.props.customPagerComponent !== 'function'){
      console.log("Couldn't find valid template.");
      return (<div></div>);
    }

    return (<that.props.customPagerComponent {...this.props.customPagerComponentOptions} maxPage={this.props.maxPage} nextText={this.props.nextText} previousText={this.props.previousText} currentPage={this.props.currentPage} setPage={this.props.setPage} previous={this.props.previous} next={this.props.next} />);
  }
});

module.exports = CustomPaginationContainer;
