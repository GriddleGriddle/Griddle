/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react/addons');
var GridRowContainer = require('./gridRowContainer.jsx');
var _ = require('underscore');

var GridBody = React.createClass({
  getDefaultProps: function(){
    return{
      "data": [],
      "metadataColumns": [],
      "className": "",
      "infiniteScroll": false,
      "gridScroll": null,
      "bodyHeight": null,
      "rowHeight": null,
      "infiniteScrollSpacerHeight": null
    }
  },
  render: function() {
    var that = this;
    //figure out if we need to wrap the group in one tbody or many
    var anyHasChildren = false;

    var nodes = this.props.data.map(function(row, index){
        var hasChildren = (typeof row["children"] !== "undefined") && row["children"].length > 0;

        //at least one item in the group has children.
        if (hasChildren) { anyHasChildren = hasChildren; }

        return <GridRowContainer data={row} metadataColumns={that.props.metadataColumns} columnMetadata={that.props.columnMetadata} rowHeight={that.props.rowHeight} key={index} uniqueId={_.uniqueId("grid_row") } hasChildren={hasChildren} tableClassName={that.props.className}/>
    });

    var gridStyle = null;
    var infiniteScrollSpacerRow = null;
    if (this.props.infiniteScroll) {
      // If we're enabling infinite scrolling, we'll want to include the max height of the grid body + allow scrolling.
      gridStyle = {
        "overflow-y": "scroll",
        "height": this.props.bodyHeight
      };

      infiniteScrollSpacerRow = <tr style={{"height": this.props.infiniteScrollSpacerHeight}}></tr>;
    }

    //check to see if any of the rows have children... if they don't wrap everything in a tbody so the browser doesn't auto do this
    if (!anyHasChildren){
      nodes = <tbody>{nodes}{infiniteScrollSpacerRow}</tbody>
    }

    return (
            <div onScroll={this.props.gridScroll} style={gridStyle}>
              <table className={this.props.className}>
                  {nodes}
              </table>
            </div>
        );
    }
});

module.exports = GridBody;
