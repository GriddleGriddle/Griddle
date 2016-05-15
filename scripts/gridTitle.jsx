/*
 See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
 */
var React = require('react');
var ColumnProperties = require('./columnProperties.js');
var assign = require('lodash.assign');

var DefaultHeaderComponent = React.createClass({
    render: function () {
        return (<span>{this.props.displayName}</span>);
    }
});

var GridTitle = React.createClass({
    getDefaultProps: function () {
        return {
            "columnSettings": null,
            "filterByColumn": function () {
            },
            "rowSettings": null,
            "sortSettings": null,
            "multipleSelectionSettings": null,
            "headerStyle": null,
            "useGriddleStyles": true,
            "useGriddleIcons": true,
            "headerStyles": {},
        }
    },
    componentWillMount: function () {
        this.verifyProps();
    },
    sort: function (column) {
        var that = this;
        return function (event) {
            that.props.sortSettings.changeSort(column);
        };
    },
    toggleSelectAll: function (event) {
        this.props.multipleSelectionSettings.toggleSelectAll();
    },
    handleSelectionChange: function (event) {
        //hack to get around warning message that's not helpful in this case
        return;
    },
    verifyProps: function () {
        if (this.props.columnSettings === null) {
            console.error("gridTitle: The columnSettings prop is null and it shouldn't be");
        }

        if (this.props.sortSettings === null) {
            console.error("gridTitle: The sortSettings prop is null and it shouldn't be");
        }
    },
    render: function () {
        this.verifyProps();
        var that = this;
        let titleStyles = {};

        var nodes = this.props.columnSettings.getColumns().map(function (col, index) {
            let defaultTitleStyles = {};
            var columnSort = "";
            var columnIsSortable = that.props.columnSettings.getMetadataColumnProperty(col, "sortable", true);
            var sortComponent = columnIsSortable ? that.props.sortSettings.sortDefaultComponent : null;

            if (that.props.sortSettings.sortColumn == col && that.props.sortSettings.sortAscending) {
                columnSort = that.props.sortSettings.sortAscendingClassName;
                sortComponent = that.props.useGriddleIcons && that.props.sortSettings.sortAscendingComponent;
            } else if (that.props.sortSettings.sortColumn == col && that.props.sortSettings.sortAscending === false) {
                columnSort += that.props.sortSettings.sortDescendingClassName;
                sortComponent = that.props.useGriddleIcons && that.props.sortSettings.sortDescendingComponent;
            }

            var meta = that.props.columnSettings.getColumnMetadataByName(col);
            var displayName = that.props.columnSettings.getMetadataColumnProperty(col, "displayName", col);
            var HeaderComponent = that.props.columnSettings.getMetadataColumnProperty(col, "customHeaderComponent", DefaultHeaderComponent);
            var headerProps = that.props.columnSettings.getMetadataColumnProperty(col, "customHeaderComponentProps", {});

            columnSort = meta == null ? columnSort : (columnSort && (columnSort + " ") || columnSort) + that.props.columnSettings.getMetadataColumnProperty(col, "cssClassName", "");

            if (that.props.useGriddleStyles) {
                defaultTitleStyles = {
                    backgroundColor: "#EDEDEF",
                    border: "0px",
                    borderBottom: "1px solid #DDD",
                    color: "#222",
                    padding: "5px",
                    cursor: columnIsSortable ? "pointer" : "default"
                }
            }
            titleStyles = meta && meta.titleStyles ? assign({}, defaultTitleStyles, meta.titleStyles) : assign({}, defaultTitleStyles);
            return (
                <th onClick={columnIsSortable ? that.sort(col) : null} data-title={col} className={columnSort} key={col}
                    style={titleStyles}>
                    <HeaderComponent columnName={col} displayName={displayName}
                                     filterByColumn={that.props.filterByColumn} {...headerProps}/>
                    {sortComponent}
                </th>);
        });

        if (nodes && this.props.multipleSelectionSettings.isMultipleSelection) {
            nodes.unshift(<th key="selection" onClick={this.toggleSelectAll} style={titleStyles}>
                <input type="checkbox"
                       checked={this.props.multipleSelectionSettings.getIsSelectAllChecked()}
                       onChange={this.handleSelectionChange}/>
            </th>);
        }

        //Get the row from the row settings.
        var className = that.props.rowSettings && that.props.rowSettings.getHeaderRowMetadataClass() || null;

        return (
            <thead>
            <tr
                className={className}
                style={this.props.headerStyles}>
                {nodes}
            </tr>
            </thead>
        );
    }
});

module.exports = GridTitle;
