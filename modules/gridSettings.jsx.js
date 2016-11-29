/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
'use strict';

var React = require('react');
var _ = require('underscore');

var GridSettings = React.createClass({
    displayName: 'GridSettings',

    getDefaultProps: function getDefaultProps() {
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
            "toggleCustomComponent": function toggleCustomComponent() {}
        };
    },
    setPageSize: function setPageSize(event) {
        var value = parseInt(event.target.value, 10);
        this.props.setPageSize(value);
    },
    handleChange: function handleChange(event) {
        var columnName = event.target.dataset ? event.target.dataset.name : event.target.getAttribute('data-name');
        if (event.target.checked === true && _.contains(this.props.selectedColumns, columnName) === false) {
            this.props.selectedColumns.push(columnName);
            this.props.setColumns(this.props.selectedColumns);
        } else {
            /* redraw with the selected columns minus the one just unchecked */
            this.props.setColumns(_.without(this.props.selectedColumns, columnName));
        }
    },
    render: function render() {
        var that = this;

        var nodes = [];
        //don't show column selector if we're on a custom component
        if (that.props.useCustomComponent === false) {
            nodes = this.props.columns.map(function (col, index) {
                var checked = _.contains(that.props.selectedColumns, col);
                //check column metadata -- if this one is locked make it disabled and don't put an onChange event
                var meta = _.findWhere(that.props.columnMetadata, { columnName: col });
                var displayName = col;

                if (typeof meta !== "undefined" && typeof meta.displayName !== "undefined" && meta.displayName != null) {
                    displayName = meta.displayName;
                }

                if (typeof meta !== "undefined" && meta != null && meta.locked) {
                    return React.createElement('div', { className: 'column checkbox' }, React.createElement('label', null, React.createElement('input', { type: 'checkbox', disabled: true, name: 'check', checked: checked, 'data-name': col }), displayName));
                } else if (typeof meta !== "undefined" && meta != null && typeof meta.visible !== "undefined" && meta.visible === false) {
                    return null;
                }
                return React.createElement('div', { className: 'griddle-column-selection checkbox', key: col, style: that.props.useGriddleStyles ? { "float": "left", width: "20%" } : null }, React.createElement('label', null, React.createElement('input', { type: 'checkbox', name: 'check', onChange: that.handleChange, checked: checked, 'data-name': col }), displayName));
            });
        }

        var toggleCustom = that.props.enableToggleCustom ? React.createElement('div', { className: 'form-group' }, React.createElement('label', { htmlFor: 'maxRows' }, React.createElement('input', { type: 'checkbox', checked: this.props.useCustomComponent, onChange: this.props.toggleCustomComponent }), ' ', this.props.enableCustomFormatText)) : "";

        var setPageSize = this.props.showSetPageSize ? React.createElement('div', null, React.createElement('label', { htmlFor: 'maxRows' }, this.props.maxRowsText, ':', React.createElement('select', { onChange: this.setPageSize, value: this.props.resultsPerPage }, React.createElement('option', { value: '5' }, '5'), React.createElement('option', { value: '10' }, '10'), React.createElement('option', { value: '25' }, '25'), React.createElement('option', { value: '50' }, '50'), React.createElement('option', { value: '100' }, '100')))) : "";

        return React.createElement('div', { className: 'griddle-settings', style: this.props.useGriddleStyles ? { backgroundColor: "#FFF", border: "1px solid #DDD", color: "#222", padding: "10px", marginBottom: "10px" } : null }, React.createElement('h6', null, this.props.settingsText), React.createElement('div', { className: 'griddle-columns', style: this.props.useGriddleStyles ? { clear: "both", display: "table", width: "100%", borderBottom: "1px solid #EDEDED", marginBottom: "10px" } : null }, nodes), setPageSize, toggleCustom);
    }
});

module.exports = GridSettings;
