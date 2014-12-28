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
           "useSortCharacters": true
        }
    },
    sort: function(event){
        this.props.changeSort(event.target.dataset.title);
    },
    render: function(){
        var that = this;

        var nodes = this.props.columns.map(function(col, index){
            var columnSort = "";
            var sortCharacter = ""; 

            var titleStyles = null; 

            if (that.props.useGriddleStyles){
              titleStyles = {
                backgroundColor: "#EDEDEF",
                border: "0",
                borderBottom: "1px solid #DDD",
                color: "#222",
                padding: "5px"
              } 
            }

            if(that.props.sortColumn == col && that.props.sortAscending){
                columnSort = "sort-ascending";
                sortCharacter = " ▴";
            }  else if (that.props.sortColumn == col && that.props.sortAscending === false){
                columnSort += "sort-descending";
                sortCharacter = " ▾";
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

            if(that.props.useSortCharacters){
              displayName = displayName + sortCharacter;
            }
            return (<th onClick={that.sort} data-title={col} className={columnSort} key={displayName} style={titleStyles}>{displayName}</th>);
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
