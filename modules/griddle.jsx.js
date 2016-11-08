/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
'use strict';

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }return target;
};

var React = require('react');
var GridTable = require('./gridTable.jsx');
var GridFilter = require('./gridFilter.jsx');
var GridPagination = require('./gridPagination.jsx');
var GridSettings = require('./gridSettings.jsx');
var GridNoData = require('./gridNoData.jsx');
var GridRow = require('./gridRow.jsx');
var GridRowContainer = require('./gridRowContainer.jsx');
var CustomRowComponentContainer = require('./customRowComponentContainer.jsx');
var CustomPaginationContainer = require('./customPaginationContainer.jsx');
var CustomFilterContainer = require('./customFilterContainer.jsx');
var ColumnProperties = require('./columnProperties');
var RowProperties = require('./rowProperties');
var deep = require('./deep');

var drop = require('lodash/drop');
var dropRight = require('lodash/dropRight');
var find = require('lodash/find');
var first = require('lodash/take');
var forEach = require('lodash/forEach');
var initial = require('lodash/initial');
var intersection = require('lodash/intersection');
var isArray = require('lodash/isArray');
var isEmpty = require('lodash/isEmpty');
var isNull = require('lodash/isNull');
var isUndefined = require('lodash/isUndefined');
var omit = require('lodash/omit');
var map = require('lodash/map');
var extend = require('lodash/assign');
var _filter = require('lodash/filter');

var _orderBy = require('lodash/orderBy');
var _property = require('lodash/property');
var _get = require('lodash/get');

var Griddle = React.createClass({
    displayName: 'Griddle',

    statics: {
        GridTable: GridTable,
        GridFilter: GridFilter,
        GridPagination: GridPagination,
        GridSettings: GridSettings,
        GridRow: GridRow
    },
    columnSettings: null,
    rowSettings: null,
    getDefaultProps: function getDefaultProps() {
        return {
            "columns": [],
            "gridMetadata": null,
            "columnMetadata": [],
            "rowMetadata": null,
            "results": [], // Used if all results are already loaded.
            "initialSort": "",
            "gridClassName": "",
            "tableClassName": "",
            "customRowComponentClassName": "",
            "settingsText": "Settings",
            "filterPlaceholderText": "Filter Results",
            "nextText": "Next",
            "previousText": "Previous",
            "maxRowsText": "Rows per page",
            "enableCustomFormatText": "Enable Custom Formatting",
            //this column will determine which column holds subgrid data
            //it will be passed through with the data object but will not be rendered
            "childrenColumnName": "children",
            //Any column in this list will be treated as metadata and will be passed through with the data but won't be rendered
            "metadataColumns": [],
            "showFilter": false,
            "showSettings": false,
            "useCustomRowComponent": false,
            "useCustomGridComponent": false,
            "useCustomPagerComponent": false,
            "useCustomFilterer": false,
            "useCustomFilterComponent": false,
            "useGriddleStyles": true,
            "useGriddleIcons": true,
            "customRowComponent": null,
            "customGridComponent": null,
            "customPagerComponent": {},
            "customFilterComponent": null,
            "customFilterer": null,
            "globalData": null,
            "enableToggleCustom": false,
            "noDataMessage": "There is no data to display.",
            "noDataClassName": "griddle-nodata",
            "customNoDataComponent": null,
            "customNoDataComponentProps": null,
            "allowEmptyGrid": false,
            "showTableHeading": true,
            "showPager": true,
            "useFixedHeader": false,
            "useExternal": false,
            "externalSetPage": null,
            "externalChangeSort": null,
            "externalSetFilter": null,
            "externalSetPageSize": null,
            "externalMaxPage": null,
            "externalCurrentPage": null,
            "externalSortColumn": null,
            "externalSortAscending": true,
            "externalLoadingComponent": null,
            "externalIsLoading": false,
            "enableInfiniteScroll": false,
            "bodyHeight": null,
            "paddingHeight": 5,
            "rowHeight": 25,
            "infiniteScrollLoadTreshold": 50,
            "useFixedLayout": true,
            "isSubGriddle": false,
            "enableSort": true,
            "onRowClick": null,
            /* css class names */
            "sortAscendingClassName": "sort-ascending",
            "sortDescendingClassName": "sort-descending",
            "parentRowCollapsedClassName": "parent-row",
            "parentRowExpandedClassName": "parent-row expanded",
            "settingsToggleClassName": "settings",
            "nextClassName": "griddle-next",
            "previousClassName": "griddle-previous",
            "headerStyles": {},
            /* icon components */
            "sortAscendingComponent": " ▲",
            "sortDescendingComponent": " ▼",
            "sortDefaultComponent": null,
            "parentRowCollapsedComponent": "▶",
            "parentRowExpandedComponent": "▼",
            "settingsIconComponent": "",
            "nextIconComponent": "",
            "previousIconComponent": "",
            "isMultipleSelection": false, //currently does not support subgrids
            "selectedRowIds": [],
            "uniqueIdentifier": "id",
            "onSelectionChange": null
        };
    },
    propTypes: {
        isMultipleSelection: React.PropTypes.bool,
        selectedRowIds: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.number), React.PropTypes.arrayOf(React.PropTypes.string)]),
        uniqueIdentifier: React.PropTypes.string,
        onSelectionChange: React.PropTypes.func
    },
    defaultFilter: function defaultFilter(results, filter) {
        var that = this;
        return _filter(results, function (item) {
            var arr = deep.keys(item);
            for (var i = 0; i < arr.length; i++) {
                var isFilterable = that.columnSettings.getMetadataColumnProperty(arr[i], "filterable", true);
                if (isFilterable && (deep.getAt(item, arr[i]) || "").toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
                    return true;
                }
            }
            return false;
        });
    },

    filterByColumnFilters: function filterByColumnFilters(columnFilters) {
        var filteredResults = Object.keys(columnFilters).reduce(function (previous, current) {
            return _filter(previous, function (item) {
                if (deep.getAt(item, current || "").toString().toLowerCase().indexOf(columnFilters[current].toLowerCase()) >= 0) {
                    return true;
                }

                return false;
            });
        }, this.props.results);

        var newState = {
            columnFilters: columnFilters
        };

        if (columnFilters) {
            newState.filteredResults = filteredResults;
            newState.maxPage = this.getMaxPage(newState.filteredResults);
        } else if (this.state.filter) {
            newState.filteredResults = this.props.useCustomFilterer ? this.props.customFilterer(this.props.results, filter) : this.defaultFilter(this.props.results, filter);
        } else {
            newState.filteredResults = null;
        }

        this.setState(newState);
    },

    filterByColumn: function filterByColumn(filter, column) {
        var columnFilters = this.state.columnFilters;

        //if filter is "" remove it from the columnFilters object
        if (columnFilters.hasOwnProperty(column) && !filter) {
            columnFilters = omit(columnFilters, column);
        } else {
            var newObject = {};
            newObject[column] = filter;
            columnFilters = extend({}, columnFilters, newObject);
        }

        this.filterByColumnFilters(columnFilters);
    },

    /* if we have a filter display the max page and results accordingly */
    setFilter: function setFilter(filter) {
        if (this.props.useExternal) {
            this.props.externalSetFilter(filter);
            return;
        }

        var that = this,
            updatedState = {
            page: 0,
            filter: filter
        };

        // Obtain the state results.
        updatedState.filteredResults = this.props.useCustomFilterer ? this.props.customFilterer(this.props.results, filter) : this.defaultFilter(this.props.results, filter);

        // Update the max page.
        updatedState.maxPage = that.getMaxPage(updatedState.filteredResults);

        //if filter is null or undefined reset the filter.
        if (isUndefined(filter) || isNull(filter) || isEmpty(filter)) {
            updatedState.filter = filter;
            updatedState.filteredResults = null;
        }

        // Set the state.
        that.setState(updatedState);

        this._resetSelectedRows();
    },
    setPageSize: function setPageSize(size) {
        if (this.props.useExternal) {
            this.setState({
                resultsPerPage: size
            });
            this.props.externalSetPageSize(size);
            return;
        }
        //make this better.
        this.state.resultsPerPage = size;
        this.setMaxPage();
    },
    toggleColumnChooser: function toggleColumnChooser() {
        this.setState({
            showColumnChooser: !this.state.showColumnChooser
        });
    },
    isNullOrUndefined: function isNullOrUndefined(value) {
        return value === undefined || value === null;
    },
    shouldUseCustomRowComponent: function shouldUseCustomRowComponent() {
        return this.isNullOrUndefined(this.state.useCustomRowComponent) ? this.props.useCustomRowComponent : this.state.useCustomRowComponent;
    },
    shouldUseCustomGridComponent: function shouldUseCustomGridComponent() {
        return this.isNullOrUndefined(this.state.useCustomGridComponent) ? this.props.useCustomGridComponent : this.state.useCustomGridComponent;
    },
    toggleCustomComponent: function toggleCustomComponent() {
        if (this.state.customComponentType === "grid") {
            this.setState({
                useCustomGridComponent: !this.shouldUseCustomGridComponent()
            });
        } else if (this.state.customComponentType === "row") {
            this.setState({
                useCustomRowComponent: !this.shouldUseCustomRowComponent()
            });
        }
    },
    getMaxPage: function getMaxPage(results, totalResults) {
        if (this.props.useExternal) {
            return this.props.externalMaxPage;
        }

        if (!totalResults) {
            totalResults = (results || this.getCurrentResults()).length;
        }
        var maxPage = Math.ceil(totalResults / this.state.resultsPerPage);
        return maxPage;
    },
    setMaxPage: function setMaxPage(results) {
        var maxPage = this.getMaxPage(results);
        //re-render if we have new max page value
        if (this.state.maxPage !== maxPage) {
            this.setState({ page: 0, maxPage: maxPage, filteredColumns: this.columnSettings.filteredColumns });
        }
    },
    setPage: function setPage(number) {
        if (this.props.useExternal) {
            this.props.externalSetPage(number);
            return;
        }

        //check page size and move the filteredResults to pageSize * pageNumber
        if (number * this.state.resultsPerPage <= this.state.resultsPerPage * this.state.maxPage) {
            var that = this,
                state = {
                page: number
            };

            that.setState(state);
        }

        //When infinite scrolling is enabled, uncheck the "select all" checkbox, since more unchecked rows will be appended at the end
        if (this.props.enableInfiniteScroll) {
            this.setState({
                isSelectAllChecked: false
            });
        }
    },
    setColumns: function setColumns(columns) {
        this.columnSettings.filteredColumns = isArray(columns) ? columns : [columns];

        this.setState({
            filteredColumns: this.columnSettings.filteredColumns
        });
    },
    nextPage: function nextPage() {
        var currentPage = this.getCurrentPage();
        if (currentPage < this.getCurrentMaxPage() - 1) {
            this.setPage(currentPage + 1);
        }
    },
    previousPage: function previousPage() {
        var currentPage = this.getCurrentPage();
        if (currentPage > 0) {
            this.setPage(currentPage - 1);
        }
    },
    changeSort: function changeSort(column) {
        if (this.props.enableSort === false) {
            return;
        }

        if (this.props.useExternal) {
            var isAscending = this.props.externalSortColumn === column ? !this.props.externalSortAscending : true;
            this.setState({
                sortColumn: column,
                sortDirection: isAscending ? 'asc' : 'desc'
            });
            this.props.externalChangeSort(column, isAscending);
            return;
        }
        var columnMeta = find(this.props.columnMetadata, { columnName: column }) || {};
        var sortDirectionCycle = columnMeta.sortDirectionCycle ? columnMeta.sortDirectionCycle : [null, 'asc', 'desc'];
        var sortDirection = null;
        // Find the current position in the cycle (or -1).
        var i = sortDirectionCycle.indexOf(this.state.sortDirection && column === this.state.sortColumn ? this.state.sortDirection : null);

        // Proceed to the next position in the cycle (or start at the beginning).
        i = (i + 1) % sortDirectionCycle.length;

        if (sortDirectionCycle[i]) {
            sortDirection = sortDirectionCycle[i];
        } else {
            sortDirection = null;
        }

        var state = {
            page: 0,
            sortColumn: column,
            sortDirection: sortDirection
        };

        this.setState(state);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.setMaxPage(nextProps.results);
        if (nextProps.resultsPerPage !== this.props.resultsPerPage) {
            this.setPageSize(nextProps.resultsPerPage);
        }
        //This will updaet the column Metadata
        this.columnSettings.columnMetadata = nextProps.columnMetadata;
        if (nextProps.results.length > 0) {
            var deepKeys = deep.keys(nextProps.results[0]);

            var is_same = this.columnSettings.allColumns.length == deepKeys.length && this.columnSettings.allColumns.every(function (element, index) {
                return element === deepKeys[index];
            });

            if (!is_same) {
                this.columnSettings.allColumns = deepKeys;
            }
        } else if (this.columnSettings.allColumns.length > 0) {
            this.columnSettings.allColumns = [];
        }

        if (nextProps.columns !== this.columnSettings.filteredColumns) {
            this.columnSettings.filteredColumns = nextProps.columns;
        }

        if (nextProps.selectedRowIds) {
            var visibleRows = this.getDataForRender(this.getCurrentResults(nextProps.results), this.columnSettings.getColumns(), true);

            this.setState({
                isSelectAllChecked: this._getAreAllRowsChecked(nextProps.selectedRowIds, map(visibleRows, this.props.uniqueIdentifier)),
                selectedRowIds: nextProps.selectedRowIds
            });
        }
    },
    getInitialState: function getInitialState() {
        var state = {
            maxPage: 0,
            page: 0,
            filteredResults: null,
            filteredColumns: [],
            filter: "",
            //this sets the individual column filters
            columnFilters: {},
            resultsPerPage: this.props.resultsPerPage || 5,
            showColumnChooser: false,
            isSelectAllChecked: false,
            selectedRowIds: this.props.selectedRowIds
        };
        return state;
    },
    componentWillMount: function componentWillMount() {
        this.verifyExternal();
        this.verifyCustom();

        this.columnSettings = new ColumnProperties(this.props.results.length > 0 ? deep.keys(this.props.results[0]) : [], this.props.columns, this.props.childrenColumnName, this.props.columnMetadata, this.props.metadataColumns);

        this.rowSettings = new RowProperties(this.props.rowMetadata, this.props.useCustomTableRowComponent && this.props.customTableRowComponent ? this.props.customTableRowComponent : GridRow, this.props.useCustomTableRowComponent);

        if (this.props.initialSort) {
            this.changeSort(this.props.initialSort);
        }
        this.setMaxPage();

        //don't like the magic strings
        if (this.shouldUseCustomGridComponent()) {
            this.setState({
                customComponentType: "grid"
            });
        } else if (this.shouldUseCustomRowComponent()) {
            this.setState({
                customComponentType: "row"
            });
        } else {
            this.setState({
                filteredColumns: this.columnSettings.filteredColumns
            });
        }
    },
    componentDidMount: function componentDidMount() {
        if (this.props.componentDidMount && typeof this.props.componentDidMount === "function") {
            return this.props.componentDidMount();
        }
    },
    //todo: clean these verify methods up
    verifyExternal: function verifyExternal() {
        if (this.props.useExternal === true) {
            //hooray for big ugly nested if
            if (this.props.externalSetPage === null) {
                console.error("useExternal is set to true but there is no externalSetPage function specified.");
            }

            if (this.props.externalChangeSort === null) {
                console.error("useExternal is set to true but there is no externalChangeSort function specified.");
            }

            if (this.props.externalSetFilter === null) {
                console.error("useExternal is set to true but there is no externalSetFilter function specified.");
            }

            if (this.props.externalSetPageSize === null) {
                console.error("useExternal is set to true but there is no externalSetPageSize function specified.");
            }

            if (this.props.externalMaxPage === null) {
                console.error("useExternal is set to true but externalMaxPage is not set.");
            }

            if (this.props.externalCurrentPage === null) {
                console.error("useExternal is set to true but externalCurrentPage is not set. Griddle will not page correctly without that property when using external data.");
            }
        }
    },
    //TODO: Do this with propTypes
    verifyCustom: function verifyCustom() {
        if (this.props.useCustomGridComponent === true && this.props.customGridComponent === null) {
            console.error("useCustomGridComponent is set to true but no custom component was specified.");
        }
        if (this.props.useCustomRowComponent === true && this.props.customRowComponent === null) {
            console.error("useCustomRowComponent is set to true but no custom component was specified.");
        }
        if (this.props.useCustomGridComponent === true && this.props.useCustomRowComponent === true) {
            console.error("Cannot currently use both customGridComponent and customRowComponent.");
        }
        if (this.props.useCustomFilterer === true && this.props.customFilterer === null) {
            console.error("useCustomFilterer is set to true but no custom filter function was specified.");
        }
        if (this.props.useCustomFilterComponent === true && this.props.customFilterComponent === null) {
            console.error("useCustomFilterComponent is set to true but no customFilterComponent was specified.");
        }
    },
    getDataForRender: function getDataForRender(data, cols, pageList) {
        var _this = this;

        var that = this;

        // get the correct page size
        if (this.state.sortColumn !== "") {
            var column = this.state.sortColumn;
            var sortColumn = _filter(this.props.columnMetadata, { columnName: column });
            var customCompareFn;
            var multiSort = {
                columns: [],
                orders: []
            };

            if (sortColumn.length > 0) {
                customCompareFn = sortColumn[0].hasOwnProperty("customCompareFn") && sortColumn[0]["customCompareFn"];
                if (sortColumn[0]["multiSort"]) {
                    multiSort = sortColumn[0]["multiSort"];
                }
            }

            if (this.state.sortDirection) {
                if (typeof customCompareFn === 'function') {
                    if (customCompareFn.length === 2) {
                        data = data.sort(function (a, b) {
                            return customCompareFn(_get(a, column), _get(b, column));
                        });

                        if (this.state.sortDirection === 'desc') {
                            data.reverse();
                        }
                    } else if (customCompareFn.length === 1) {
                        data = _orderBy(data, function (item) {
                            return customCompareFn(_get(item, column));
                        }, [this.state.sortDirection]);
                    }
                } else {
                    var iteratees = [_property(column)];
                    var orders = [this.state.sortDirection];
                    multiSort.columns.forEach(function (col, i) {
                        iteratees.push(_property(col));
                        if (multiSort.orders[i] === 'asc' || multiSort.orders[i] === 'desc') {
                            orders.push(multiSort.orders[i]);
                        } else {
                            orders.push(_this.state.sortDirection);
                        }
                    });

                    data = _orderBy(data, iteratees, orders);
                }
            }
        }

        var currentPage = this.getCurrentPage();

        if (!this.props.useExternal && pageList && this.state.resultsPerPage * (currentPage + 1) <= this.state.resultsPerPage * this.state.maxPage && currentPage >= 0) {
            if (this.isInfiniteScrollEnabled()) {
                // If we're doing infinite scroll, grab all results up to the current page.
                data = first(data, (currentPage + 1) * this.state.resultsPerPage);
            } else {
                //the 'rest' is grabbing the whole array from index on and the 'initial' is getting the first n results
                var rest = drop(data, currentPage * this.state.resultsPerPage);
                data = (dropRight || initial)(rest, rest.length - this.state.resultsPerPage);
            }
        }

        var meta = this.columnSettings.getMetadataColumns;

        var transformedData = [];

        for (var i = 0; i < data.length; i++) {
            var mappedData = data[i];

            if (typeof mappedData[that.props.childrenColumnName] !== "undefined" && mappedData[that.props.childrenColumnName].length > 0) {
                //internally we're going to use children instead of whatever it is so we don't have to pass the custom name around
                mappedData["children"] = that.getDataForRender(mappedData[that.props.childrenColumnName], cols, false);

                if (that.props.childrenColumnName !== "children") {
                    delete mappedData[that.props.childrenColumnName];
                }
            }

            transformedData.push(mappedData);
        }
        return transformedData;
    },
    getCurrentResults: function getCurrentResults(results) {
        return this.state.filteredResults || results || this.props.results;
    },
    getCurrentPage: function getCurrentPage() {
        return this.props.externalCurrentPage || this.state.page;
    },
    getCurrentSort: function getCurrentSort() {
        return this.props.useExternal ? this.props.externalSortColumn : this.state.sortColumn;
    },
    getCurrentSortAscending: function getCurrentSortAscending() {
        return this.props.useExternal ? this.props.externalSortAscending : this.state.sortDirection === 'asc';
    },
    getCurrentMaxPage: function getCurrentMaxPage() {
        return this.props.useExternal ? this.props.externalMaxPage : this.state.maxPage;
    },
    //This takes the props relating to sort and puts them in one object
    getSortObject: function getSortObject() {
        return {
            enableSort: this.props.enableSort,
            changeSort: this.changeSort,
            sortColumn: this.getCurrentSort(),
            sortAscending: this.getCurrentSortAscending(),
            sortDirection: this.state.sortDirection,
            sortAscendingClassName: this.props.sortAscendingClassName,
            sortDescendingClassName: this.props.sortDescendingClassName,
            sortAscendingComponent: this.props.sortAscendingComponent,
            sortDescendingComponent: this.props.sortDescendingComponent,
            sortDefaultComponent: this.props.sortDefaultComponent
        };
    },
    _toggleSelectAll: function _toggleSelectAll() {
        var visibleRows = this.getDataForRender(this.getCurrentResults(), this.columnSettings.getColumns(), true),
            newIsSelectAllChecked = !this.state.isSelectAllChecked,
            newSelectedRowIds = JSON.parse(JSON.stringify(this.state.selectedRowIds));

        var self = this;
        forEach(visibleRows, function (row) {
            self._updateSelectedRowIds(row[self.props.uniqueIdentifier], newSelectedRowIds, newIsSelectAllChecked);
        }, this);

        this.setState({
            isSelectAllChecked: newIsSelectAllChecked,
            selectedRowIds: newSelectedRowIds
        });

        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(newSelectedRowIds, newIsSelectAllChecked);
        }
    },
    _toggleSelectRow: function _toggleSelectRow(row, isChecked) {
        var visibleRows = this.getDataForRender(this.getCurrentResults(), this.columnSettings.getColumns(), true),
            newSelectedRowIds = JSON.parse(JSON.stringify(this.state.selectedRowIds));

        this._updateSelectedRowIds(row[this.props.uniqueIdentifier], newSelectedRowIds, isChecked);

        var newIsSelectAllChecked = this._getAreAllRowsChecked(newSelectedRowIds, map(visibleRows, this.props.uniqueIdentifier));

        this.setState({
            isSelectAllChecked: newIsSelectAllChecked,
            selectedRowIds: newSelectedRowIds
        });

        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(newSelectedRowIds, newIsSelectAllChecked);
        }
    },
    _updateSelectedRowIds: function _updateSelectedRowIds(id, selectedRowIds, isChecked) {

        var isFound;

        if (isChecked) {
            isFound = find(selectedRowIds, function (item) {
                return id === item;
            });

            if (isFound === undefined) {
                selectedRowIds.push(id);
            }
        } else {
            selectedRowIds.splice(selectedRowIds.indexOf(id), 1);
        }
    },
    _getIsSelectAllChecked: function _getIsSelectAllChecked() {

        return this.state.isSelectAllChecked;
    },
    _getAreAllRowsChecked: function _getAreAllRowsChecked(selectedRowIds, visibleRowIds) {

        return visibleRowIds.length === intersection(visibleRowIds, selectedRowIds).length;
    },
    _getIsRowChecked: function _getIsRowChecked(row) {

        return this.state.selectedRowIds.indexOf(row[this.props.uniqueIdentifier]) > -1 ? true : false;
    },
    getSelectedRowIds: function getSelectedRowIds() {

        return this.state.selectedRowIds;
    },
    _resetSelectedRows: function _resetSelectedRows() {

        this.setState({
            isSelectAllChecked: false,
            selectedRowIds: []
        });
    },
    //This takes the props relating to multiple selection and puts them in one object
    getMultipleSelectionObject: function getMultipleSelectionObject() {

        return {
            isMultipleSelection: find(this.props.results, function (result) {
                return 'children' in result;
            }) ? false : this.props.isMultipleSelection, //does not support subgrids
            toggleSelectAll: this._toggleSelectAll,
            getIsSelectAllChecked: this._getIsSelectAllChecked,
            toggleSelectRow: this._toggleSelectRow,
            getSelectedRowIds: this.getSelectedRowIds,
            getIsRowChecked: this._getIsRowChecked
        };
    },
    isInfiniteScrollEnabled: function isInfiniteScrollEnabled() {
        // If a custom pager is included, don't allow for infinite scrolling.
        if (this.props.useCustomPagerComponent) {
            return false;
        }

        // Otherwise, send back the property.
        return this.props.enableInfiniteScroll;
    },
    getClearFixStyles: function getClearFixStyles() {
        return {
            clear: "both",
            display: "table",
            width: "100%"
        };
    },
    getSettingsStyles: function getSettingsStyles() {
        return {
            "float": "left",
            width: "50%",
            textAlign: "right"
        };
    },
    getFilterStyles: function getFilterStyles() {
        return {
            "float": "left",
            width: "50%",
            textAlign: "left",
            color: "#222",
            minHeight: "1px"
        };
    },
    getFilter: function getFilter() {
        return this.props.showFilter && this.shouldUseCustomGridComponent() === false ? this.props.useCustomFilterComponent ? React.createElement(CustomFilterContainer, { changeFilter: this.setFilter, placeholderText: this.props.filterPlaceholderText, customFilterComponent: this.props.customFilterComponent, results: this.props.results, currentResults: this.getCurrentResults() }) : React.createElement(GridFilter, { changeFilter: this.setFilter, placeholderText: this.props.filterPlaceholderText }) : "";
    },
    getSettings: function getSettings() {
        return this.props.showSettings ? React.createElement('button', { type: 'button', className: this.props.settingsToggleClassName, onClick: this.toggleColumnChooser,
            style: this.props.useGriddleStyles ? { background: "none", border: "none", padding: 0, margin: 0, fontSize: 14 } : null }, this.props.settingsText, this.props.settingsIconComponent) : "";
    },
    getTopSection: function getTopSection(filter, settings) {
        if (this.props.showFilter === false && this.props.showSettings === false) {
            return "";
        }

        var filterStyles = null,
            settingsStyles = null,
            topContainerStyles = null;

        if (this.props.useGriddleStyles) {
            filterStyles = this.getFilterStyles();
            settingsStyles = this.getSettingsStyles();

            topContainerStyles = this.getClearFixStyles();
        }

        return React.createElement('div', { className: 'top-section', style: topContainerStyles }, React.createElement('div', { className: 'griddle-filter', style: filterStyles }, filter), React.createElement('div', { className: 'griddle-settings-toggle', style: settingsStyles }, settings));
    },
    getPagingSection: function getPagingSection(currentPage, maxPage) {
        if ((this.props.showPager && !this.isInfiniteScrollEnabled() && !this.shouldUseCustomGridComponent()) === false) {
            return undefined;
        }

        return React.createElement('div', { className: 'griddle-footer' }, this.props.useCustomPagerComponent ? React.createElement(CustomPaginationContainer, { customPagerComponentOptions: this.props.customPagerComponentOptions, next: this.nextPage, previous: this.previousPage, currentPage: currentPage, maxPage: maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText, customPagerComponent: this.props.customPagerComponent }) : React.createElement(GridPagination, { useGriddleStyles: this.props.useGriddleStyles, next: this.nextPage, previous: this.previousPage, nextClassName: this.props.nextClassName, nextIconComponent: this.props.nextIconComponent, previousClassName: this.props.previousClassName, previousIconComponent: this.props.previousIconComponent, currentPage: currentPage, maxPage: maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText }));
    },
    getColumnSelectorSection: function getColumnSelectorSection(keys, cols) {
        return this.state.showColumnChooser ? React.createElement(GridSettings, { columns: keys, selectedColumns: cols, setColumns: this.setColumns, settingsText: this.props.settingsText,
            settingsIconComponent: this.props.settingsIconComponent, maxRowsText: this.props.maxRowsText, setPageSize: this.setPageSize,
            showSetPageSize: !this.shouldUseCustomGridComponent(), resultsPerPage: this.state.resultsPerPage, enableToggleCustom: this.props.enableToggleCustom,
            toggleCustomComponent: this.toggleCustomComponent, useCustomComponent: this.shouldUseCustomRowComponent() || this.shouldUseCustomGridComponent(),
            useGriddleStyles: this.props.useGriddleStyles, enableCustomFormatText: this.props.enableCustomFormatText, columnMetadata: this.props.columnMetadata }) : "";
    },
    getCustomGridSection: function getCustomGridSection() {
        return React.createElement(this.props.customGridComponent, _extends({ data: this.props.results, className: this.props.customGridComponentClassName }, this.props.gridMetadata));
    },
    getCustomRowSection: function getCustomRowSection(data, cols, meta, pagingContent, globalData) {
        return React.createElement('div', null, React.createElement(CustomRowComponentContainer, { data: data, columns: cols, metadataColumns: meta, globalData: globalData,
            className: this.props.customRowComponentClassName, customComponent: this.props.customRowComponent,
            style: this.props.useGriddleStyles ? this.getClearFixStyles() : null }), this.props.showPager && pagingContent);
    },
    getStandardGridSection: function getStandardGridSection(data, cols, meta, pagingContent, hasMorePages) {
        var sortProperties = this.getSortObject();
        var multipleSelectionProperties = this.getMultipleSelectionObject();

        // no data section
        var showNoData = this.shouldShowNoDataSection(data);
        var noDataSection = this.getNoDataSection();

        return React.createElement('div', { className: 'griddle-body' }, React.createElement(GridTable, { useGriddleStyles: this.props.useGriddleStyles,
            noDataSection: noDataSection,
            showNoData: showNoData,
            columnSettings: this.columnSettings,
            rowSettings: this.rowSettings,
            sortSettings: sortProperties,
            multipleSelectionSettings: multipleSelectionProperties,
            filterByColumn: this.filterByColumn,
            isSubGriddle: this.props.isSubGriddle,
            useGriddleIcons: this.props.useGriddleIcons,
            useFixedLayout: this.props.useFixedLayout,
            showPager: this.props.showPager,
            pagingContent: pagingContent,
            data: data,
            className: this.props.tableClassName,
            enableInfiniteScroll: this.isInfiniteScrollEnabled(),
            nextPage: this.nextPage,
            showTableHeading: this.props.showTableHeading,
            useFixedHeader: this.props.useFixedHeader,
            parentRowCollapsedClassName: this.props.parentRowCollapsedClassName,
            parentRowExpandedClassName: this.props.parentRowExpandedClassName,
            parentRowCollapsedComponent: this.props.parentRowCollapsedComponent,
            parentRowExpandedComponent: this.props.parentRowExpandedComponent,
            bodyHeight: this.props.bodyHeight,
            paddingHeight: this.props.paddingHeight,
            rowHeight: this.props.rowHeight,
            infiniteScrollLoadTreshold: this.props.infiniteScrollLoadTreshold,
            externalLoadingComponent: this.props.externalLoadingComponent,
            externalIsLoading: this.props.externalIsLoading,
            hasMorePages: hasMorePages,
            onRowClick: this.props.onRowClick }));
    },
    getContentSection: function getContentSection(data, cols, meta, pagingContent, hasMorePages, globalData) {
        if (this.shouldUseCustomGridComponent() && this.props.customGridComponent !== null) {
            return this.getCustomGridSection();
        } else if (this.shouldUseCustomRowComponent()) {
            return this.getCustomRowSection(data, cols, meta, pagingContent, globalData);
        } else {
            return this.getStandardGridSection(data, cols, meta, pagingContent, hasMorePages);
        }
    },
    getNoDataSection: function getNoDataSection() {
        if (this.props.customNoDataComponent != null) {
            return React.createElement('div', { className: this.props.noDataClassName }, React.createElement(this.props.customNoDataComponent, this.props.customNoDataComponentProps));
        }
        return React.createElement(GridNoData, { noDataMessage: this.props.noDataMessage });
    },
    shouldShowNoDataSection: function shouldShowNoDataSection(results) {
        if (this.props.allowEmptyGrid) {
            return false;
        }

        return this.props.useExternal === false && (typeof results === 'undefined' || results.length === 0) || this.props.useExternal === true && this.props.externalIsLoading === false && results.length === 0;
    },
    render: function render() {
        var that = this,
            results = this.getCurrentResults(); // Attempt to assign to the filtered results, if we have any.

        var headerTableClassName = this.props.tableClassName + " table-header";

        //figure out if we want to show the filter section
        var filter = this.getFilter();
        var settings = this.getSettings();

        //if we have neither filter or settings don't need to render this stuff
        var topSection = this.getTopSection(filter, settings);

        var keys = [];
        var cols = this.columnSettings.getColumns();
        //figure out which columns are displayed and show only those
        var data = this.getDataForRender(results, cols, true);

        var meta = this.columnSettings.getMetadataColumns();

        // Grab the column keys from the first results
        keys = deep.keys(omit(results[0], meta));

        // sort keys by order
        keys = this.columnSettings.orderColumns(keys);

        // Grab the current and max page values.
        var currentPage = this.getCurrentPage();
        var maxPage = this.getCurrentMaxPage();

        // Determine if we need to enable infinite scrolling on the table.
        var hasMorePages = currentPage + 1 < maxPage;

        // Grab the paging content if it's to be displayed
        var pagingContent = this.getPagingSection(currentPage, maxPage);

        var resultContent = this.getContentSection(data, cols, meta, pagingContent, hasMorePages, this.props.globalData);

        var columnSelector = this.getColumnSelectorSection(keys, cols);

        var gridClassName = this.props.gridClassName.length > 0 ? "griddle " + this.props.gridClassName : "griddle";
        //add custom to the class name so we can style it differently
        gridClassName += this.shouldUseCustomRowComponent() ? " griddle-custom" : "";

        return React.createElement('div', { className: gridClassName }, topSection, columnSelector, React.createElement('div', { className: 'griddle-container', style: this.props.useGriddleStyles && !this.props.isSubGriddle ? { border: "1px solid #DDD" } : null }, resultContent));
    }
});

GridRowContainer.Griddle = module.exports = Griddle;
