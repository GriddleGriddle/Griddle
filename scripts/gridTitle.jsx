/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var _ = require('underscore');

var GridTitle = React.createClass({
    getDefaultProps: function(){
        return {
           "columns":[],
           "sortColumn": "",
           "sortAscending": true,
           "headerStyle": null,
           "useGriddleStyles": true,
           "usGriddleIcons": true,
           "sortAscendingClassName": "sort-ascending",
           "sortDescendingClassName": "sort-descending",
           "sortAscendingComponent": " ▲",
           "sortDescendingComponent": " ▼",
           "enableSort": true
        }
    },
    sort: function(event){
        this.props.changeSort(event.target.dataset.title||event.target.parentElement.dataset.title);
    },
    render: function(){
        var that = this;

        var nodes = this.props.columns.map(function(col, index){
            var columnSort = "";
            var sortComponent = null;
            var titleStyles = null;

            if (that.props.useGriddleStyles){
              titleStyles = {
                backgroundColor: "#EDEDEF",
                border: "0",
                borderBottom: "1px solid #DDD",
                color: "#222",
                padding: "5px",
                cursor: that.props.enableSort ? "pointer" : "default"
              }
            }

            if(that.props.sortColumn == col && that.props.sortAscending){
                columnSort = that.props.sortAscendingClassName;
                sortComponent = that.props.useGriddleIcons && that.props.sortAscendingComponent;
            }  else if (that.props.sortColumn == col && that.props.sortAscending === false){
                columnSort += that.props.sortDescendingClassName;
                sortComponent = that.props.useGriddleIcons && that.props.sortDescendingComponent;
            }

            var displayName = col;
            if (that.props.columnMetadata != null){
              var meta = _.findWhere(that.props.columnMetadata, {columnName: col})
              //the weird code is just saying add the space if there's text in columnSort otherwise just set to metaclassname
              columnSort = meta == null ? columnSort : (columnSort && (columnSort + " ")||columnSort) + meta.cssClassName;
              if (typeof meta !== "undefined" && typeof meta.displayName !== "undefined" && meta.displayName != null) {
                  displayName = meta.displayName;
              }
            }

            return (<th onClick={that.sort} data-title={col} className={columnSort} key={displayName} style={titleStyles}>{displayName}{sortComponent}</th>);
        });


        return(
            <thead>
                <tr style={this.titleStyles}>
                    {nodes}
                </tr>
            </thead>
        );
    }
});

module.exports = GridTitle;
