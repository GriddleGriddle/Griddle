/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react/addons');

var GridSettings = React.createClass({
    getDefaultProps: function(){
        return {
            "columns": [],
            "selectedColumns": [],
            "settingsText": "",
            "maxRowsText": "",
            "resultsPerPage": 0
        };
    },
    setPageSize: function(event){
        var value = parseInt(event.target.value);
        this.props.setPageSize(value);
    },
    handleChange: function(event){
        if(event.target.checked == true && _.contains(this.props.selectedColumns, event.target.dataset.name) == false){
            this.props.selectedColumns.push(event.target.dataset.name);
            this.props.setColumns(this.props.selectedColumns);
        } else {
            /* redraw with the selected columns minus the one just unchecked */
            this.props.setColumns(_.without(this.props.selectedColumns, event.target.dataset.name));
        }
    },
    render: function(){
        var that = this;
        var nodes = this.props.columns.map(function(col, index){
            var checked = _.contains(that.props.selectedColumns, col);
            return <div className="column checkbox"><label><input type="checkbox" name="check" onChange={that.handleChange} checked={checked}  data-name={col}/>{col}</label></div>
        });
        return (<div className="columnSelector panel"><h5>{this.props.settingsText}</h5><div className="container-fluid"><div className="row">{nodes}</div></div><hr />
            <label for="maxRows">{this.props.maxRowsText}:</label>
            <select class="form-control" onChange={this.setPageSize} value={this.props.resultsPerPage}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            </div>);
    }
});

module.exports = GridSettings;
