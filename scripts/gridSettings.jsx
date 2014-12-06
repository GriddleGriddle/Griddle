/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var _ = require('underscore');

var GridSettings = React.createClass({
    getDefaultProps: function(){
        return {
            "columns": [],
            "columnMetadata": [],
            "selectedColumns": [],
            "settingsText": "",
            "maxRowsText": "",
            "resultsPerPage": 0,
            "allowToggleCustom": false,
            "useCustomFormat": false,
            "toggleCustomFormat": function(){}
        };
    },
    setPageSize: function(event){
        var value = parseInt(event.target.value, 10);
        this.props.setPageSize(value);
    },
    handleChange: function(event){
        if(event.target.checked === true && _.contains(this.props.selectedColumns, event.target.dataset.name) === false){
            this.props.selectedColumns.push(event.target.dataset.name);
            this.props.setColumns(this.props.selectedColumns);
        } else {
            /* redraw with the selected columns minus the one just unchecked */
            this.props.setColumns(_.without(this.props.selectedColumns, event.target.dataset.name));
        }
    },
    render: function(){
        var that = this;

        var nodes = [];
        //don't show column selector if we're on a custom format
        if (that.props.useCustomFormat === false){
            nodes = this.props.columns.map(function(col, index){
                var checked = _.contains(that.props.selectedColumns, col);
                //check column metadata -- if this one is locked make it disabled and don't put an onChange event
                var meta  = _.findWhere(that.props.columnMetadata, {columnName: col});
                if(typeof meta !== "undefined" && meta != null && meta.locked){
                    return <div className="column checkbox"><label><input type="checkbox" disabled name="check" checked={checked}  data-name={col}/>{col}</label></div>
                }
                return <div className="column checkbox"><label><input type="checkbox" name="check" onChange={that.handleChange} checked={checked}  data-name={col}/>{col}</label></div>
            });
        }

        var toggleCustom = that.props.allowToggleCustom ?   
                (<div className="form-group">
                    <label htmlFor="maxRows">{this.props.enableCustomFormatText}:</label>
                    <input type="checkbox" checked={this.props.useCustomFormat} onChange={this.props.toggleCustomFormat} />
                </div>)
                : "";

        return (<div className="griddle-settings panel">
                <h5>{this.props.settingsText}</h5>
                <div className="container-fluid griddle-columns">
                    <div className="row">{nodes}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="maxRows">{this.props.maxRowsText}:</label>
                    <select onChange={this.setPageSize} value={this.props.resultsPerPage}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
                {toggleCustom}
            </div>);
    }
});

module.exports = GridSettings;
