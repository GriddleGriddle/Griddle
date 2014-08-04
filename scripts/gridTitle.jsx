/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react/addons');

var GridTitle = React.createClass({
    sort: function(event){
        this.props.changeSort(event.target.dataset.title);
    },
    render: function(){
        var that = this;

        var nodes = this.props.columns.map(function(col, index){
            var columnSort = "";

            if(that.props.sortColumn == col && that.props.sortAscending){
                columnSort = "sort-ascending"
            }  else if (that.props.sortColumn == col && that.props.sortAscending == false){
                columnSort += "sort-descending"
            }
            return <th onClick={that.sort} data-title={col} className={columnSort}>{col}</th>
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
