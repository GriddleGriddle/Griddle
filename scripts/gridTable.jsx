/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var GridTitle = require('./gridTitle.jsx');
var GridRowContainer = require('./gridRowContainer.jsx');
var _ = require('underscore');

var GridTable = React.createClass({
  getDefaultProps: function(){
    return{
      "data": [],
      "metadataColumns": [],
      "className": "",
      "enableInfiniteScroll": false,
      "nextPage": null,
      "hasMorePages": false,
      "useFixedHeader": false,
      "useFixedLayout": true,
      "infiniteScrollSpacerHeight": null,
      "bodyHeight": null,
      "tableHeading": "",
      "useGriddleStyles": true,
      "useGriddleIcons": true,
      "isSubGriddle": false,
      "sortAscendingClassName": "sort-ascending",
      "sortDescendingClassName": "sort-descending",
      "parentRowCollapsedClassName": "parent-row",
      "parentRowExpandedClassName": "parent-row expanded",
      "sortAscendingComponent": " ▲",
      "sortDescendingComponent": " ▼",
      "parentRowCollapsedComponent": "▶",
      "parentRowExpandedComponent": "▼",
      "externalLoadingComponent": null,
      "externalIsLoading": false,
      "enableSort": true
    }
  },
  componentDidMount: function() {
    // After the initial render, see if we need to load additional pages.
    this.gridScroll();
  },
  componentDidUpdate: function(prevProps, prevState) {
    // After the subsequent renders, see if we need to load additional pages.
    this.gridScroll();
  },
  gridScroll: function(){
    if (this.props.enableInfiniteScroll && !this.props.externalIsLoading) {
      // If the scroll height is greater than the current amount of rows displayed, update the page.
      var scrollable = this.refs.scrollable.getDOMNode();
      var scrollTop = scrollable.scrollTop
      var scrollHeight = scrollable.scrollHeight;
      var clientHeight = scrollable.clientHeight;

      // Determine the diff by subtracting the amount scrolled by the total height, taking into consideratoin
      // the spacer's height.
      var scrollHeightDiff = scrollHeight - (scrollTop + clientHeight) - this.props.infiniteScrollSpacerHeight;

      // Make sure that we load results a little before reaching the bottom.
      var compareHeight = scrollHeightDiff * 0.8;

      if (compareHeight <= this.props.infiniteScrollSpacerHeight) {
        this.props.nextPage();
      }
    }
  },
  render: function() {
    var that = this;
    //figure out if we need to wrap the group in one tbody or many
    var anyHasChildren = false;

    var nodes = null;

    // If the data is still being loaded, don't build the nodes unless this is an infinite scroll table.
    if (!this.props.externalIsLoading || this.props.enableInfiniteScroll) {
      nodes = this.props.data.map(function(row, index){
          var hasChildren = (typeof row["children"] !== "undefined") && row["children"].length > 0;

          //at least one item in the group has children.
          if (hasChildren) { anyHasChildren = hasChildren; }

          return (<GridRowContainer useGriddleStyles={that.props.useGriddleStyles} isSubGriddle={that.props.isSubGriddle}
            sortAscendingClassName={that.props.sortAscendingClassName} sortDescendingClassName={that.props.sortDescendingClassName}
            parentRowExpandedClassName={that.props.parentRowExpandedClassName} parentRowCollapsedClassName={that.props.parentRowCollapsedClassName}
            parentRowExpandedComponent={that.props.parentRowExpandedComponent} parentRowCollapsedComponent={that.props.parentRowCollapsedComponent}
            data={row} metadataColumns={that.props.metadataColumns} columnMetadata={that.props.columnMetadata} key={index}
            uniqueId={_.uniqueId("grid_row") } hasChildren={hasChildren} tableClassName={that.props.className}/>)
      });
    }

    var gridStyle = null;
    var loadingContent = null;
    var tableStyle = {
      width: "100%"
    };

    if(this.props.useFixedLayout){
      tableStyle.tableLayout = "fixed";
    }

    var infiniteScrollSpacerRow = null;
    if (this.props.enableInfiniteScroll) {
      // If we're enabling infinite scrolling, we'll want to include the max height of the grid body + allow scrolling.
      gridStyle = {
        "position": "relative",
        "overflowY": "scroll",
        "height": this.props.bodyHeight + "px",
        "width": "100%"
      };

      // Only add the spacer row if the height is defined.
      if (this.props.infiniteScrollSpacerHeight && this.props.hasMorePages) {
        var spacerStyle = {
          "height": this.props.infiniteScrollSpacerHeight + "px"
        };

        infiniteScrollSpacerRow = <tr style={spacerStyle}></tr>;
      }
    }

    // If we're currently loading, populate the loading content
    if (this.props.externalIsLoading) {
      var defaultLoadingStyle = null;
      var defaultColSpan = null;

      if (this.props.useGriddleStyles) {
        defaultLoadingStyle = {
          textAlign: "center",
          paddingBottom: "40px"
        };

        defaultColSpan = this.props.columns.length;
      }

      var loadingComponent = this.props.externalLoadingComponent ?
        (<this.props.externalLoadingComponent/>) :
        (<div>Loading...</div>);

      loadingContent = (<tbody><tr><td style={defaultLoadingStyle} colSpan={defaultColSpan}>{loadingComponent}</td></tr></tbody>);
    }

    //construct the table heading component
    var tableHeading = (this.props.showTableHeading ?
        <GridTitle columns={this.props.columns} useGriddleStyles={this.props.useGriddleStyles} useGriddleIcons={this.props.useGriddleIcons}
          changeSort={this.props.changeSort} sortColumn={this.props.sortColumn} sortAscending={this.props.sortAscending}
          sortAscendingClassName={this.props.sortAscendingClassName} sortDescendingClassName={this.props.sortDescendingClassName}
          sortAscendingComponent={this.props.sortAscendingComponent} sortDescendingComponent={this.props.sortDescendingComponent}
          columnMetadata={this.props.columnMetadata} enableSort={this.props.enableSort}/>
        : "");

    //check to see if any of the rows have children... if they don't wrap everything in a tbody so the browser doesn't auto do this
    if (!anyHasChildren){
      nodes = <tbody>{nodes}{infiniteScrollSpacerRow}</tbody>
    }

    var pagingContent = "";
    if(this.props.showPager){
      var pagingStyles = this.props.useGriddleStyles ?
        {
          "padding" : "0",
          backgroundColor: "#EDEDED",
          border: "0",
          color: "#222"
        }
        : null;

      pagingContent = (<tbody><tr>
          <td colSpan={this.props.columns.length} style={pagingStyles} className="footer-container">
            {this.props.pagingContent}
          </td>
        </tr></tbody>)
    }

    // If we have a fixed header, split into two tables.
    if (this.props.useFixedHeader){
      if (this.props.useGriddleStyles) {
        tableStyle.tableLayout = "fixed";
      }

      return <div>
              <table className={this.props.className} style={(this.props.useGriddleStyles&&tableStyle)||null}>
                {tableHeading}
              </table>
              <div ref="scrollable" onScroll={this.gridScroll} style={gridStyle}>
                <table className={this.props.className} style={(this.props.useGriddleStyles&&tableStyle)||null}>
                    {nodes}
                    {loadingContent}
                    {pagingContent}
                </table>
              </div>
            </div>;
    }

    return  <div ref="scrollable" onScroll={this.gridScroll} style={gridStyle}>
              <table className={this.props.className} style={(this.props.useGriddleStyles&&tableStyle)||null}>
                  {tableHeading}
                  {nodes}
                  {loadingContent}
                  {pagingContent}
              </table>
            </div>
    }
});

module.exports = GridTable;
