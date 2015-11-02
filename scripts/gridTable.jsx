/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var GridTitle = require('./gridTitle.jsx');
var GridRowContainer = require('./gridRowContainer.jsx');
var ColumnProperties = require('./columnProperties.js');
var RowProperties = require('./rowProperties.js');
var _ = require('underscore');

var GridTable = React.createClass({
  getDefaultProps: function(){
    return{
      "data": [],
      "columnSettings": null,
      "rowSettings": null,
      "sortSettings": null,
      "multipleSelectionSettings": null,
      "className": "",
      "enableInfiniteScroll": false,
      "nextPage": null,
      "hasMorePages": false,
      "useFixedHeader": false,
      "useFixedLayout": true,
      "paddingHeight": null,
      "rowHeight": null,
      "infiniteScrollLoadTreshold": null,
      "bodyHeight": null,
      "useGriddleStyles": true,
      "useGriddleIcons": true,
      "isSubGriddle": false,
      "parentRowCollapsedClassName": "parent-row",
      "parentRowExpandedClassName": "parent-row expanded",
      "parentRowCollapsedComponent": "▶",
      "parentRowExpandedComponent": "▼",
      "externalLoadingComponent": null,
      "externalIsLoading": false,
      "onRowClick": null
    }
  },
  getInitialState: function(){
      return {
         scrollTop: 0,
         scrollHeight: this.props.bodyHeight,
         clientHeight: this.props.bodyHeight
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

      // If the scroll position changed and the difference is greater than a row height
      if (this.props.rowHeight !== null &&
          this.state.scrollTop !== scrollTop &&
          Math.abs(this.state.scrollTop - scrollTop) >= this.getAdjustedRowHeight()) {
        var newState = {
          scrollTop : scrollTop,
          scrollHeight: scrollHeight,
          clientHeight: clientHeight
        };

        // Set the state to the new state
        this.setState(newState);
      }

      // Determine the diff by subtracting the amount scrolled by the total height, taking into consideratoin
      // the spacer's height.
      var scrollHeightDiff = scrollHeight - (scrollTop + clientHeight) - this.props.infiniteScrollLoadTreshold;

      // Make sure that we load results a little before reaching the bottom.
      var compareHeight = scrollHeightDiff * 0.6;

      if (compareHeight <= this.props.infiniteScrollLoadTreshold) {
        this.props.nextPage();
      }
    }
  },
  verifyProps: function(){
    if(this.props.columnSettings === null){
       console.error("gridTable: The columnSettings prop is null and it shouldn't be");
    }
    if(this.props.rowSettings === null){
       console.error("gridTable: The rowSettings prop is null and it shouldn't be");
    }
  },
  getAdjustedRowHeight: function() {
    return this.props.rowHeight + this.props.paddingHeight * 2; // account for padding.
  },
  getNodeContent: function() {
    this.verifyProps();
    var that = this;

    //figure out if we need to wrap the group in one tbody or many
    var anyHasChildren = false;

    // If the data is still being loaded, don't build the nodes unless this is an infinite scroll table.
    if (!this.props.externalIsLoading || this.props.enableInfiniteScroll) {
      var nodeData = that.props.data;
      var aboveSpacerRow = null;
      var belowSpacerRow = null;
      var usingDefault = false;

      // If we have a row height specified, only render what's going to be visible.
      if (this.props.enableInfiniteScroll && this.props.rowHeight !== null && this.refs.scrollable !== undefined) {
        var adjustedHeight = that.getAdjustedRowHeight();
        var visibleRecordCount = Math.ceil(that.state.clientHeight / adjustedHeight);

        // Inspired by : http://jsfiddle.net/vjeux/KbWJ2/9/
        var displayStart = Math.max(0, Math.floor(that.state.scrollTop / adjustedHeight) - visibleRecordCount * 0.25);
        var displayEnd = Math.min(displayStart + visibleRecordCount * 1.25, this.props.data.length - 1);

        // Split the amount of nodes.
        nodeData = nodeData.slice(displayStart, displayEnd+1);

        // Set the above and below nodes.
        var aboveSpacerRowStyle = { height: (displayStart * adjustedHeight) + "px" };
        aboveSpacerRow = (<tr key={'above-' + aboveSpacerRowStyle.height} style={aboveSpacerRowStyle}></tr>);
        var belowSpacerRowStyle = { height: ((this.props.data.length - displayEnd) * adjustedHeight) + "px" };
        belowSpacerRow = (<tr key={'below-' + belowSpacerRowStyle.height} style={belowSpacerRowStyle}></tr>);
      }

      var nodes = nodeData.map(function(row, index){
          var hasChildren = (typeof row["children"] !== "undefined") && row["children"].length > 0;
          var uniqueId = that.props.rowSettings.getRowKey(row);

          //at least one item in the group has children.
          if (hasChildren) { anyHasChildren = hasChildren; }

          return (<GridRowContainer useGriddleStyles={that.props.useGriddleStyles} isSubGriddle={that.props.isSubGriddle}
            parentRowExpandedClassName={that.props.parentRowExpandedClassName} parentRowCollapsedClassName={that.props.parentRowCollapsedClassName}
            parentRowExpandedComponent={that.props.parentRowExpandedComponent} parentRowCollapsedComponent={that.props.parentRowCollapsedComponent}
            data={row} key={uniqueId + '-container'} uniqueId={uniqueId} columnSettings={that.props.columnSettings} rowSettings={that.props.rowSettings} paddingHeight={that.props.paddingHeight}
		    multipleSelectionSettings={that.props.multipleSelectionSettings}
            rowHeight={that.props.rowHeight} hasChildren={hasChildren} tableClassName={that.props.className} onRowClick={that.props.onRowClick} />)
      });

      // Add the spacer rows for nodes we're not rendering.
      if (aboveSpacerRow) {
        nodes.unshift(aboveSpacerRow);
      }
      if (belowSpacerRow) {
        nodes.push(belowSpacerRow);
      }

      // Send back the nodes.
      return {
        nodes: nodes,
        anyHasChildren : anyHasChildren
      };
    } else {
      return null;
    }
  },
  render: function() {
    var that = this;
    var nodes = [];

    // for if we need to wrap the group in one tbody or many
    var anyHasChildren = false;

    // Grab the nodes to render
    var nodeContent = this.getNodeContent();
    if (nodeContent) {
      nodes = nodeContent.nodes;
      anyHasChildren = nodeContent.anyHasChildren;
    }

    var gridStyle = null;
    var loadingContent = null;
    var tableStyle = {
      width: "100%"
    };

    if(this.props.useFixedLayout){
      tableStyle.tableLayout = "fixed";
    }

    if (this.props.enableInfiniteScroll) {
      // If we're enabling infinite scrolling, we'll want to include the max height of the grid body + allow scrolling.
      gridStyle = {
        "position": "relative",
        "overflowY": "scroll",
        "height": this.props.bodyHeight + "px",
        "width": "100%"
      };
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

        defaultColSpan = this.props.columnSettings.getVisibleColumnCount();
      }

      var loadingComponent = this.props.externalLoadingComponent ?
        (<this.props.externalLoadingComponent/>) :
        (<div>Loading...</div>);

      loadingContent = (<tbody><tr><td style={defaultLoadingStyle} colSpan={defaultColSpan}>{loadingComponent}</td></tr></tbody>);
    }

    //construct the table heading component
    var tableHeading = (this.props.showTableHeading ?
        <GridTitle useGriddleStyles={this.props.useGriddleStyles} useGriddleIcons={this.props.useGriddleIcons}
          sortSettings={this.props.sortSettings}
		  multipleSelectionSettings={this.props.multipleSelectionSettings}
          columnSettings={this.props.columnSettings}
          rowSettings={this.props.rowSettings}/>
      : undefined);

    //check to see if any of the rows have children... if they don't wrap everything in a tbody so the browser doesn't auto do this
    if (!anyHasChildren){
      nodes = <tbody>{nodes}</tbody>
    }

    var pagingContent = <tbody />;
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
          <td colSpan={this.props.multipleSelectionSettings.isMultipleSelection ? this.props.columnSettings.getVisibleColumnCount() + 1 : this.props.columnSettings.getVisibleColumnCount()} style={pagingStyles} className="footer-container">
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
