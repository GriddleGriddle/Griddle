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
            "enableToggleCustom": false,
            "useCustomComponent": false,
            "useGriddleStyles": true,
            "toggleCustomComponent": function(){}
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
        //don't show column selector if we're on a custom component
        if (that.props.useCustomComponent === false){
            nodes = this.props.columns.map(function(col, index){
                var checked = _.contains(that.props.selectedColumns, col);
                //check column metadata -- if this one is locked make it disabled and don't put an onChange event
                var meta  = _.findWhere(that.props.columnMetadata, {columnName: col});
                var displayName = col; 

                if (typeof meta !== "undefined" && typeof meta.displayName !== "undefined" && meta.displayName != null) {
                  displayName = meta.displayName;
                }

                if(typeof meta !== "undefined" && meta != null && meta.locked){
                    return <div className="column checkbox"><label><input type="checkbox" disabled name="check" checked={checked}  data-name={col}/>{displayName}</label></div>
                } else if(typeof meta !== "undefined" && meta != null && typeof meta.visible !== "undefined" && meta.visible === false){
                    return null; 
                }
                return <div className="griddle-column-selection checkbox" style={that.props.useGriddleStyles ? { "float": "left", width: "20%"} : null }><label><input type="checkbox" name="check" onChange={that.handleChange} checked={checked}  data-name={col}/>{displayName}</label></div>
            });
        }

        var toggleCustom = that.props.enableToggleCustom ?
                (<div className="form-group">
                    <label htmlFor="maxRows"><input type="checkbox" checked={this.props.useCustomComponent} onChange={this.props.toggleCustomComponent} /> {this.props.enableCustomFormatText}</label>
                </div>)
                : "";

        var setPageSize = this.props.showSetPageSize ? (<div>
                    <label htmlFor="maxRows">{this.props.maxRowsText}:
                        <select onChange={this.setPageSize} value={this.props.resultsPerPage}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </label>
            </div>) : "";


        return (<div className="griddle-settings" style={this.props.useGriddleStyles ? { backgroundColor: "#FFF", border: "1px solid #DDD", color: "#222", padding: "10px", marginBottom: "10px"} : null }>
                <h6>{this.props.settingsText}</h6>
                <div className="griddle-columns" style={this.props.useGriddleStyles ? { clear: "both", display: "table", width: "100%", borderBottom: "1px solid #EDEDED", marginBottom: "10px"} : null }>
                    {nodes}
                </div>
                {setPageSize}
                {toggleCustom}
            </div>);
    }
});

module.exports = GridSettings;
