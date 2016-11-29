/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
"use strict";

var React = require('react');

var CustomRowComponentContainer = React.createClass({
  displayName: "CustomRowComponentContainer",

  getDefaultProps: function getDefaultProps() {
    return {
      "data": [],
      "metadataColumns": [],
      "className": "",
      "customComponent": {},
      "globalData": {}
    };
  },
  render: function render() {
    var that = this;

    if (typeof that.props.customComponent !== 'function') {
      console.log("Couldn't find valid template.");
      return React.createElement("div", { className: this.props.className });
    }

    var nodes = this.props.data.map(function (row, index) {
      return React.createElement(that.props.customComponent, { data: row, metadataColumns: that.props.metadataColumns, key: index, globalData: that.props.globalData });
    });

    var footer = this.props.showPager && this.props.pagingContent;
    return React.createElement("div", { className: this.props.className, style: this.props.style }, nodes);
  }
});

module.exports = CustomRowComponentContainer;
