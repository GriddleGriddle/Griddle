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
           "sortAscending": true
        }
    },
    sort: function(event){
        this.props.changeSort(event.target.dataset.title);
    },
    render: function(){
        var that = this;

        var nodes = this.props.columns.map(function(col, index){
            var columnSort = "";

            if(that.props.sortColumn == col && that.props.sortAscending){
                columnSort = "sort-ascending"
            }  else if (that.props.sortColumn == col && that.props.sortAscending === false){
                columnSort += "sort-descending"
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

            return (<th onClick={that.sort} data-title={col} className={columnSort} key={displayName}>{displayName}</th>);
        });

        return(
            <thead>
                <tr>
                    {nodes}
                </tr>
            </thead>
        );
    }
});

module.exports = GridTitle;
