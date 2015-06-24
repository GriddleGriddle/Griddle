(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "_"], factory);
	else if(typeof exports === 'object')
		exports["Griddle"] = factory(require("React"), require("_"));
	else
		root["Griddle"] = factory(root["React"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var GridTable = __webpack_require__(6);
	var GridFilter = __webpack_require__(7);
	var GridPagination = __webpack_require__(8);
	var GridSettings = __webpack_require__(9);
	var GridNoData = __webpack_require__(10);
	var GridRow = __webpack_require__(11);
	var CustomRowComponentContainer = __webpack_require__(12);
	var CustomPaginationContainer = __webpack_require__(13);
	var ColumnProperties = __webpack_require__(4);
	var RowProperties = __webpack_require__(5);
	var _ = __webpack_require__(3);

	var Griddle = React.createClass({
	    displayName: "Griddle",
	    statics: {
	        GridTable: GridTable,
	        GridFilter: GridFilter,
	        GridPagination: GridPagination,
	        GridSettings: GridSettings,
	        GridRow: GridRow
	    },
	    columnSettings: null,
	    rowSettings: null,
	    getDefaultProps: function () {
	        return {
	            columns: [],
	            columnMetadata: [],
	            rowMetadata: null,
	            resultsPerPage: 5,
	            results: [], // Used if all results are already loaded.
	            initialSort: "",
	            initialSortAscending: true,
	            gridClassName: "",
	            tableClassName: "",
	            customRowComponentClassName: "",
	            settingsText: "Settings",
	            filterPlaceholderText: "Filter Results",
	            nextText: "Next",
	            previousText: "Previous",
	            maxRowsText: "Rows per page",
	            enableCustomFormatText: "Enable Custom Formatting",
	            //this column will determine which column holds subgrid data
	            //it will be passed through with the data object but will not be rendered
	            childrenColumnName: "children",
	            //Any column in this list will be treated as metadata and will be passed through with the data but won't be rendered
	            metadataColumns: [],
	            showFilter: false,
	            showSettings: false,
	            useCustomRowComponent: false,
	            useCustomGridComponent: false,
	            useCustomPagerComponent: false,
	            useGriddleStyles: true,
	            useGriddleIcons: true,
	            customRowComponent: null,
	            customGridComponent: null,
	            customPagerComponent: {},
	            enableToggleCustom: false,
	            noDataMessage: "There is no data to display.",
	            noDataClassName: "griddle-nodata",
	            customNoDataComponent: null,
	            showTableHeading: true,
	            showPager: true,
	            useFixedHeader: false,
	            useExternal: false,
	            externalSetPage: null,
	            externalChangeSort: null,
	            externalSetFilter: null,
	            externalSetPageSize: null,
	            externalMaxPage: null,
	            externalCurrentPage: null,
	            externalSortColumn: null,
	            externalSortAscending: true,
	            externalLoadingComponent: null,
	            externalIsLoading: false,
	            enableInfiniteScroll: false,
	            bodyHeight: null,
	            paddingHeight: 5,
	            rowHeight: 25,
	            infiniteScrollLoadTreshold: 50,
	            useFixedLayout: true,
	            isSubGriddle: false,
	            enableSort: true,
	            onRowClick: null,
	            /* css class names */
	            sortAscendingClassName: "sort-ascending",
	            sortDescendingClassName: "sort-descending",
	            parentRowCollapsedClassName: "parent-row",
	            parentRowExpandedClassName: "parent-row expanded",
	            settingsToggleClassName: "settings",
	            nextClassName: "griddle-next",
	            previousClassName: "griddle-previous",
	            headerStyles: {},
	            /* icon components */
	            sortAscendingComponent: " ▲",
	            sortDescendingComponent: " ▼",
	            parentRowCollapsedComponent: "▶",
	            parentRowExpandedComponent: "▼",
	            settingsIconComponent: "",
	            nextIconComponent: "",
	            previousIconComponent: "",
	            isMultipleSelection: false, //currently does not support subgrids
	            selectedRowIds: [],
	            uniqueIdentifier: "id",
	            transitionName: null };
	    },
	    propTypes: {
	        isMultipleSelection: React.PropTypes.bool,
	        selectedRowIds: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.number), React.PropTypes.arrayOf(React.PropTypes.string)]),
	        uniqueIdentifier: React.PropTypes.string
	    },
	    /* if we have a filter display the max page and results accordingly */
	    setFilter: function (filter) {
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
	        updatedState.filteredResults = _.filter(this.props.results, function (item) {
	            var arr = _.values(item);
	            for (var i = 0; i < arr.length; i++) {
	                if ((arr[i] || "").toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
	                    return true;
	                }
	            }

	            return false;
	        });

	        // Update the max page.
	        updatedState.maxPage = that.getMaxPage(updatedState.filteredResults);

	        //if filter is null or undefined reset the filter.
	        if (_.isUndefined(filter) || _.isNull(filter) || _.isEmpty(filter)) {
	            updatedState.filter = filter;
	            updatedState.filteredResults = null;
	        }

	        // Set the state.
	        that.setState(updatedState);

	        this._resetSelectedRows();
	    },
	    setPageSize: function (size) {
	        if (this.props.useExternal) {
	            this.props.externalSetPageSize(size);
	            return;
	        }

	        //make this better.
	        this.props.resultsPerPage = size;
	        this.setMaxPage();
	    },
	    toggleColumnChooser: function () {
	        this.setState({
	            showColumnChooser: !this.state.showColumnChooser
	        });
	    },
	    toggleCustomComponent: function () {
	        if (this.state.customComponentType === "grid") {
	            this.setProps({
	                useCustomGridComponent: !this.props.useCustomGridComponent
	            });
	        } else if (this.state.customComponentType === "row") {
	            this.setProps({
	                useCustomRowComponent: !this.props.useCustomRowComponent
	            });
	        }
	    },
	    getMaxPage: function (results, totalResults) {
	        if (this.props.useExternal) {
	            return this.props.externalMaxPage;
	        }

	        if (!totalResults) {
	            totalResults = (results || this.getCurrentResults()).length;
	        }
	        var maxPage = Math.ceil(totalResults / this.props.resultsPerPage);
	        return maxPage;
	    },
	    setMaxPage: function (results) {
	        var maxPage = this.getMaxPage(results);
	        //re-render if we have new max page value
	        if (this.state.maxPage !== maxPage) {
	            this.setState({ page: 0, maxPage: maxPage, filteredColumns: this.columnSettings.filteredColumns });
	        }
	    },
	    setPage: function (number) {
	        if (this.props.useExternal) {
	            this.props.externalSetPage(number);
	            return;
	        }

	        //check page size and move the filteredResults to pageSize * pageNumber
	        if (number * this.props.resultsPerPage <= this.props.resultsPerPage * this.state.maxPage) {
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
	        } else {
	            //When the paging is done on the server, the previously selected rows on a certain page might not
	            // coincide with the new rows on that exact page page, if moving back and forth. Better reset the selection
	            this._resetSelectedRows();
	        }
	    },
	    setColumns: function (columns) {
	        this.columnSettings.filteredColumns = _.isArray(columns) ? columns : [columns];

	        this.setState({
	            filteredColumns: this.columnSettings.filteredColumns
	        });
	    },
	    nextPage: function () {
	        var currentPage = this.getCurrentPage();
	        if (currentPage < this.getCurrentMaxPage() - 1) {
	            this.setPage(currentPage + 1);
	        }
	    },
	    previousPage: function () {
	        var currentPage = this.getCurrentPage();
	        if (currentPage > 0) {
	            this.setPage(currentPage - 1);
	        }
	    },
	    changeSort: function (sort) {
	        if (this.props.enableSort === false) {
	            return;
	        }
	        if (this.props.useExternal) {
	            this.props.externalChangeSort(sort, this.props.externalSortColumn === sort ? !this.props.externalSortAscending : true);
	            return;
	        }

	        var that = this,
	            state = {
	            page: 0,
	            sortColumn: sort,
	            sortAscending: true
	        };

	        // If this is the same column, reverse the sort.
	        if (this.state.sortColumn == sort) {
	            state.sortAscending = !this.state.sortAscending;
	        }

	        this.setState(state);

	        //When the sorting is done on the server, the previously selected rows might not correspond with the new ones.
	        //Better reset the selection
	        this._resetSelectedRows();
	    },
	    componentWillReceiveProps: function (nextProps) {
	        this.setMaxPage(nextProps.results);

	        if (nextProps.columns !== this.columnSettings.filteredColumns) {
	            this.columnSettings.filteredColumns = nextProps.columns;
	        }

	        if (nextProps.selectedRowIds) {
	            var visibleRows = this.getDataForRender(this.getCurrentResults(), this.columnSettings.getColumns(), true);

	            this.setState({
	                isSelectAllChecked: this._getAreAllRowsChecked(nextProps.selectedRowIds, _.pluck(visibleRows, this.props.uniqueIdentifier)),
	                selectedRowIds: nextProps.selectedRowIds
	            });
	        }
	    },
	    getInitialState: function () {
	        var state = {
	            maxPage: 0,
	            page: 0,
	            filteredResults: null,
	            filteredColumns: [],
	            filter: "",
	            sortColumn: this.props.initialSort,
	            sortAscending: this.props.initialSortAscending,
	            showColumnChooser: false,
	            isSelectAllChecked: false,
	            selectedRowIds: this.props.selectedRowIds
	        };

	        return state;
	    },
	    componentWillMount: function () {
	        this.verifyExternal();
	        this.verifyCustom();

	        this.columnSettings = new ColumnProperties(this.props.results.length > 0 ? _.keys(this.props.results[0]) : [], this.props.columns, this.props.childrenColumnName, this.props.columnMetadata, this.props.metadataColumns);

	        this.rowSettings = new RowProperties(this.props.rowMetadata, this.props.useCustomTableRowComponent && this.props.customTableRowComponent ? this.props.customTableRowComponent : GridRow, this.props.useCustomTableRowComponent);

	        this.setMaxPage();

	        //don't like the magic strings
	        if (this.props.useCustomGridComponent === true) {
	            this.setState({
	                customComponentType: "grid"
	            });
	        } else if (this.props.useCustomRowComponent === true) {
	            this.setState({
	                customComponentType: "row"
	            });
	        } else {
	            this.setState({
	                filteredColumns: this.columnSettings.filteredColumns
	            });
	        }
	    },
	    //todo: clean these verify methods up
	    verifyExternal: function () {
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
	    verifyCustom: function () {
	        if (this.props.useCustomGridComponent === true && this.props.customGridComponent === null) {
	            console.error("useCustomGridComponent is set to true but no custom component was specified.");
	        }
	        if (this.props.useCustomRowComponent === true && this.props.customRowComponent === null) {
	            console.error("useCustomRowComponent is set to true but no custom component was specified.");
	        }
	        if (this.props.useCustomGridComponent === true && this.props.useCustomRowComponent === true) {
	            console.error("Cannot currently use both customGridComponent and customRowComponent.");
	        }
	    },
	    getDataForRender: function (data, cols, pageList) {
	        var that = this;
	        //get the correct page size
	        if (this.state.sortColumn !== "" || this.props.initialSort !== "") {
	            var sortProperty = _.where(this.props.columnMetadata, { columnName: this.state.sortColumn });
	            sortProperty = sortProperty.length > 0 && sortProperty[0].hasOwnProperty("sortProperty") && sortProperty[0].sortProperty || null;

	            data = _.sortBy(data, function (item) {
	                return sortProperty ? item[that.state.sortColumn || that.props.initialSort][sortProperty] : item[that.state.sortColumn || that.props.initialSort];
	            });

	            if (this.state.sortAscending === false) {
	                data.reverse();
	            }
	        }

	        var currentPage = this.getCurrentPage();

	        if (!this.props.useExternal && pageList && this.props.resultsPerPage * (currentPage + 1) <= this.props.resultsPerPage * this.state.maxPage && currentPage >= 0) {
	            if (this.isInfiniteScrollEnabled()) {
	                // If we're doing infinite scroll, grab all results up to the current page.
	                data = _.first(data, (currentPage + 1) * this.props.resultsPerPage);
	            } else {
	                //the 'rest' is grabbing the whole array from index on and the 'initial' is getting the first n results
	                var rest = _.drop(data, currentPage * this.props.resultsPerPage);
	                data = (_.dropRight || _.initial)(rest, rest.length - this.props.resultsPerPage);
	            }
	        }

	        var meta = this.columnSettings.getMetadataColumns;

	        var transformedData = [];

	        for (var i = 0; i < data.length; i++) {
	            var mappedData = data[i];

	            if (typeof mappedData[that.props.childrenColumnName] !== "undefined" && mappedData[that.props.childrenColumnName].length > 0) {
	                //internally we're going to use children instead of whatever it is so we don't have to pass the custom name around
	                mappedData.children = that.getDataForRender(mappedData[that.props.childrenColumnName], cols, false);

	                if (that.props.childrenColumnName !== "children") {
	                    delete mappedData[that.props.childrenColumnName];
	                }
	            }

	            transformedData.push(mappedData);
	        }
	        return transformedData;
	    },
	    //this is the current results
	    getCurrentResults: function () {
	        return this.state.filteredResults || this.props.results;
	    },
	    getCurrentPage: function () {
	        return this.props.externalCurrentPage || this.state.page;
	    },
	    getCurrentSort: function () {
	        return this.props.useExternal ? this.props.externalSortColumn : this.state.sortColumn;
	    },
	    getCurrentSortAscending: function () {
	        return this.props.useExternal ? this.props.externalSortAscending : this.state.sortAscending;
	    },
	    getCurrentMaxPage: function () {
	        return this.props.useExternal ? this.props.externalMaxPage : this.state.maxPage;
	    },
	    //This takes the props relating to sort and puts them in one object
	    getSortObject: function () {
	        return {
	            enableSort: this.props.enableSort,
	            changeSort: this.changeSort,
	            sortColumn: this.getCurrentSort(),
	            sortAscending: this.getCurrentSortAscending(),
	            sortAscendingClassName: this.props.sortAscendingClassName,
	            sortDescendingClassName: this.props.sortDescendingClassName,
	            sortAscendingComponent: this.props.sortAscendingComponent,
	            sortDescendingComponent: this.props.sortDescendingComponent
	        };
	    },
	    _toggleSelectAll: function () {
	        var visibleRows = this.getDataForRender(this.getCurrentResults(), this.columnSettings.getColumns(), true),
	            newIsSelectAllChecked = !this.state.isSelectAllChecked,
	            newSelectedRowIds = JSON.parse(JSON.stringify(this.state.selectedRowIds));

	        _.each(visibleRows, function (row) {
	            this._updateSelectedRowIds(row[this.props.uniqueIdentifier], newSelectedRowIds, newIsSelectAllChecked);
	        }, this);

	        this.setState({
	            isSelectAllChecked: newIsSelectAllChecked,
	            selectedRowIds: newSelectedRowIds
	        });
	    },
	    _toggleSelectRow: function (row, isChecked) {
	        var visibleRows = this.getDataForRender(this.getCurrentResults(), this.columnSettings.getColumns(), true),
	            newSelectedRowIds = JSON.parse(JSON.stringify(this.state.selectedRowIds));

	        this._updateSelectedRowIds(row[this.props.uniqueIdentifier], newSelectedRowIds, isChecked);

	        this.setState({
	            isSelectAllChecked: this._getAreAllRowsChecked(newSelectedRowIds, _.pluck(visibleRows, this.props.uniqueIdentifier)),
	            selectedRowIds: newSelectedRowIds
	        });
	    },
	    _updateSelectedRowIds: function (id, selectedRowIds, isChecked) {
	        var isFound;

	        if (isChecked) {
	            isFound = _.find(selectedRowIds, function (item) {
	                return id === item;
	            });

	            if (isFound === undefined) {
	                selectedRowIds.push(id);
	            }
	        } else {
	            selectedRowIds.splice(selectedRowIds.indexOf(id), 1);
	        }
	    },
	    _getIsSelectAllChecked: function () {
	        return this.state.isSelectAllChecked;
	    },
	    _getAreAllRowsChecked: function (selectedRowIds, visibleRowIds) {
	        var i, isFound;

	        if (selectedRowIds.length !== visibleRowIds.length) {
	            return false;
	        }

	        for (i = 0; i < selectedRowIds.length; i++) {
	            isFound = _.find(visibleRowIds, function (visibleRowId) {
	                return selectedRowIds[i] === visibleRowId;
	            });

	            if (isFound === undefined) {
	                return false;
	            }
	        }

	        return true;
	    },
	    _getIsRowChecked: function (row) {
	        return this.state.selectedRowIds.indexOf(row[this.props.uniqueIdentifier]) > -1 ? true : false;
	    },
	    getSelectedRowIds: function () {
	        return this.state.selectedRowIds;
	    },
	    _resetSelectedRows: function () {
	        this.setState({
	            isSelectAllChecked: false,
	            selectedRowIds: []
	        });
	    },
	    //This takes the props relating to multiple selection and puts them in one object
	    getMultipleSelectionObject: function () {
	        return {
	            isMultipleSelection: _.find(this.props.results, function (result) {
	                return "children" in result;
	            }) ? false : this.props.isMultipleSelection, //does not support subgrids
	            toggleSelectAll: this._toggleSelectAll,
	            getIsSelectAllChecked: this._getIsSelectAllChecked,

	            toggleSelectRow: this._toggleSelectRow,
	            getSelectedRowIds: this.getSelectedRowIds,
	            getIsRowChecked: this._getIsRowChecked
	        };
	    },
	    isInfiniteScrollEnabled: function () {
	        // If a custom pager is included, don't allow for infinite scrolling.
	        if (this.props.useCustomPagerComponent) {
	            return false;
	        }

	        // Otherwise, send back the property.
	        return this.props.enableInfiniteScroll;
	    },
	    getClearFixStyles: function () {
	        return {
	            clear: "both",
	            display: "table",
	            width: "100%"
	        };
	    },
	    getSettingsStyles: function () {
	        return {
	            float: "left",
	            width: "50%",
	            textAlign: "right"
	        };
	    },
	    getFilterStyles: function () {
	        return {
	            float: "left",
	            width: "50%",
	            textAlign: "left",
	            color: "#222",
	            minHeight: "1px"
	        };
	    },
	    getFilter: function () {
	        return this.props.showFilter && this.props.useCustomGridComponent === false ? React.createElement(GridFilter, { changeFilter: this.setFilter, placeholderText: this.props.filterPlaceholderText }) : "";
	    },
	    getSettings: function () {
	        return this.props.showSettings ? React.createElement(
	            "button",
	            { type: "button", className: this.props.settingsToggleClassName, onClick: this.toggleColumnChooser,
	                style: this.props.useGriddleStyles ? { background: "none", border: "none", padding: 0, margin: 0, fontSize: 14 } : null },
	            this.props.settingsText,
	            this.props.settingsIconComponent
	        ) : "";
	    },
	    getTopSection: function (filter, settings) {
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

	        return React.createElement(
	            "div",
	            { className: "top-section", style: topContainerStyles },
	            React.createElement(
	                "div",
	                { className: "griddle-filter", style: filterStyles },
	                filter
	            ),
	            React.createElement(
	                "div",
	                { className: "griddle-settings-toggle", style: settingsStyles },
	                settings
	            )
	        );
	    },
	    getPagingSection: function (currentPage, maxPage) {
	        if ((this.props.showPager && !this.isInfiniteScrollEnabled() && !this.props.useCustomGridComponent) === false) {
	            return "";
	        }

	        return React.createElement(
	            "div",
	            { className: "griddle-footer" },
	            this.props.useCustomPagerComponent ? React.createElement(CustomPaginationContainer, { next: this.nextPage, previous: this.previousPage, currentPage: currentPage, maxPage: maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText, customPagerComponent: this.props.customPagerComponent }) : React.createElement(GridPagination, { useGriddleStyles: this.props.useGriddleStyles, next: this.nextPage, previous: this.previousPage, nextClassName: this.props.nextClassName, nextIconComponent: this.props.nextIconComponent, previousClassName: this.props.previousClassName, previousIconComponent: this.props.previousIconComponent, currentPage: currentPage, maxPage: maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText })
	        );
	    },
	    getColumnSelectorSection: function (keys, cols) {
	        return this.state.showColumnChooser ? React.createElement(GridSettings, { columns: keys, selectedColumns: cols, setColumns: this.setColumns, settingsText: this.props.settingsText,
	            settingsIconComponent: this.props.settingsIconComponent, maxRowsText: this.props.maxRowsText, setPageSize: this.setPageSize,
	            showSetPageSize: !this.props.useCustomGridComponent, resultsPerPage: this.props.resultsPerPage, enableToggleCustom: this.props.enableToggleCustom,
	            toggleCustomComponent: this.toggleCustomComponent, useCustomComponent: this.props.useCustomRowComponent || this.props.useCustomGridComponent,
	            useGriddleStyles: this.props.useGriddleStyles, enableCustomFormatText: this.props.enableCustomFormatText, columnMetadata: this.props.columnMetadata }) : "";
	    },
	    getCustomGridSection: function () {
	        return React.createElement(this.props.customGridComponent, { data: this.props.results, className: this.props.customGridComponentClassName });
	    },
	    getCustomRowSection: function (data, cols, meta, pagingContent) {
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(CustomRowComponentContainer, { data: data, columns: cols, metadataColumns: meta,
	                className: this.props.customRowComponentClassName, customComponent: this.props.customRowComponent,
	                style: this.getClearFixStyles() }),
	            this.props.showPager && pagingContent
	        );
	    },
	    getStandardGridSection: function (data, cols, meta, pagingContent, hasMorePages) {
	        var sortProperties = this.getSortObject();
	        var multipleSelectionProperties = this.getMultipleSelectionObject();

	        return React.createElement(
	            "div",
	            { className: "griddle-body" },
	            React.createElement(GridTable, { useGriddleStyles: this.props.useGriddleStyles,
	                columnSettings: this.columnSettings,
	                rowSettings: this.rowSettings,
	                transitionName: this.props.transitionName,
	                sortSettings: sortProperties,
	                multipleSelectionSettings: multipleSelectionProperties,
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
	                onRowClick: this.props.onRowClick })
	        );
	    },
	    getContentSection: function (data, cols, meta, pagingContent, hasMorePages) {
	        if (this.props.useCustomGridComponent && this.props.customGridComponent !== null) {
	            return this.getCustomGridSection();
	        } else if (this.props.useCustomRowComponent) {
	            return this.getCustomRowSection(data, cols, meta, pagingContent);
	        } else {
	            return this.getStandardGridSection(data, cols, meta, pagingContent, hasMorePages);
	        }
	    },
	    getNoDataSection: function (gridClassName, topSection) {
	        var myReturn = null;
	        if (this.props.customNoDataComponent != null) {
	            myReturn = React.createElement(
	                "div",
	                { className: gridClassName },
	                React.createElement(this.props.customNoDataComponent, null)
	            );

	            return myReturn;
	        }

	        myReturn = React.createElement(
	            "div",
	            { className: gridClassName },
	            topSection,
	            React.createElement(GridNoData, { noDataMessage: this.props.noDataMessage })
	        );
	        return myReturn;
	    },
	    shouldShowNoDataSection: function (results) {
	        return this.props.useExternal === false && (typeof results === "undefined" || results.length === 0) || this.props.useExternal === true && this.props.externalIsLoading === false && results.length === 0;
	    },
	    render: function () {
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
	        keys = _.keys(_.omit(results[0], meta));

	        // sort keys by order
	        keys = this.columnSettings.orderColumns(keys);

	        // Grab the current and max page values.
	        var currentPage = this.getCurrentPage();
	        var maxPage = this.getCurrentMaxPage();

	        // Determine if we need to enable infinite scrolling on the table.
	        var hasMorePages = currentPage + 1 < maxPage;

	        // Grab the paging content if it's to be displayed
	        var pagingContent = this.getPagingSection(currentPage, maxPage);

	        var resultContent = this.getContentSection(data, cols, meta, pagingContent, hasMorePages);

	        var columnSelector = this.getColumnSelectorSection(keys, cols);

	        var gridClassName = this.props.gridClassName.length > 0 ? "griddle " + this.props.gridClassName : "griddle";
	        //add custom to the class name so we can style it differently
	        gridClassName += this.props.useCustomRowComponent ? " griddle-custom" : "";

	        if (this.shouldShowNoDataSection(results)) {
	            gridClassName += this.props.noDataClassName && this.props.noDataClassName.length > 0 ? " " + this.props.noDataClassName : "";
	            return this.getNoDataSection(gridClassName, topSection);
	        }

	        return React.createElement(
	            "div",
	            { className: gridClassName },
	            topSection,
	            columnSelector,
	            React.createElement(
	                "div",
	                { className: "griddle-container", style: this.props.useGriddleStyles && !this.props.isSubGriddle ? { border: "1px solid #DDD" } : null },
	                resultContent
	            )
	        );
	    }
	});

	module.exports = Griddle;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var _ = __webpack_require__(3);

	var ColumnProperties = (function () {
	  function ColumnProperties() {
	    var allColumns = arguments[0] === undefined ? [] : arguments[0];
	    var filteredColumns = arguments[1] === undefined ? [] : arguments[1];
	    var childrenColumnName = arguments[2] === undefined ? "children" : arguments[2];
	    var columnMetadata = arguments[3] === undefined ? [] : arguments[3];
	    var metadataColumns = arguments[4] === undefined ? [] : arguments[4];
	    _classCallCheck(this, ColumnProperties);

	    this.allColumns = allColumns;
	    this.filteredColumns = filteredColumns;
	    this.childrenColumnName = childrenColumnName;
	    this.columnMetadata = columnMetadata;
	    this.metadataColumns = metadataColumns;
	  }

	  _prototypeProperties(ColumnProperties, null, {
	    getMetadataColumns: {
	      value: function getMetadataColumns() {
	        var meta = _.map(_.where(this.columnMetadata, { visible: false }), function (item) {
	          return item.columnName;
	        });
	        if (meta.indexOf(this.childrenColumnName) < 0) {
	          meta.push(this.childrenColumnName);
	        }
	        return meta.concat(this.metadataColumns);
	      },
	      writable: true,
	      configurable: true
	    },
	    getVisibleColumnCount: {
	      value: function getVisibleColumnCount() {
	        return this.getColumns().length;
	      },
	      writable: true,
	      configurable: true
	    },
	    getColumnMetadataByName: {
	      value: function getColumnMetadataByName(name) {
	        return _.findWhere(this.columnMetadata, { columnName: name });
	      },
	      writable: true,
	      configurable: true
	    },
	    hasColumnMetadata: {
	      value: function hasColumnMetadata() {
	        return this.columnMetadata !== null && this.columnMetadata.length > 0;
	      },
	      writable: true,
	      configurable: true
	    },
	    getMetadataColumnProperty: {
	      value: function getMetadataColumnProperty(columnName, propertyName, defaultValue) {
	        var meta = this.getColumnMetadataByName(columnName);

	        //send back the default value if meta isn't there
	        if (typeof meta === "undefined" || meta === null) {
	          return defaultValue;
	        }return meta.hasOwnProperty(propertyName) ? meta[propertyName] : defaultValue;
	      },
	      writable: true,
	      configurable: true
	    },
	    orderColumns: {
	      value: function orderColumns(cols) {
	        var _this = this;
	        var ORDER_MAX = 100;

	        var orderedColumns = _.sortBy(cols, function (item) {
	          var metaItem = _.findWhere(_this.columnMetadata, { columnName: item });

	          if (typeof metaItem === "undefined" || metaItem === null || isNaN(metaItem.order)) {
	            return ORDER_MAX;
	          }

	          return metaItem.order;
	        });

	        return orderedColumns;
	      },
	      writable: true,
	      configurable: true
	    },
	    getColumns: {
	      value: function getColumns() {
	        //if we didn't set default or filter
	        var filteredColumns = this.filteredColumns.length === 0 ? this.allColumns : this.filteredColumns;

	        filteredColumns = _.difference(filteredColumns, this.metadataColumns);

	        filteredColumns = this.orderColumns(filteredColumns);

	        return filteredColumns;
	      },
	      writable: true,
	      configurable: true
	    }
	  });

	  return ColumnProperties;
	})();

	module.exports = ColumnProperties;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var _ = __webpack_require__(3);

	var RowProperties = (function () {
	  function RowProperties() {
	    var rowMetadata = arguments[0] === undefined ? {} : arguments[0];
	    var rowComponent = arguments[1] === undefined ? null : arguments[1];
	    var isCustom = arguments[2] === undefined ? false : arguments[2];
	    _classCallCheck(this, RowProperties);

	    this.rowMetadata = rowMetadata;
	    this.rowComponent = rowComponent;
	    this.isCustom = isCustom;
	  }

	  _prototypeProperties(RowProperties, null, {
	    getRowKey: {
	      value: function getRowKey(row) {
	        var uniqueId;

	        if (this.hasRowMetadataKey()) {
	          uniqueId = row[this.rowMetadata.key];
	        } else {
	          uniqueId = _.uniqueId("grid_row");
	        }

	        //todo: add error handling

	        return uniqueId;
	      },
	      writable: true,
	      configurable: true
	    },
	    hasRowMetadataKey: {
	      value: function hasRowMetadataKey() {
	        return this.hasRowMetadata() && this.rowMetadata.key !== null && this.rowMetadata.key !== undefined;
	      },
	      writable: true,
	      configurable: true
	    },
	    getBodyRowMetadataClass: {
	      value: function getBodyRowMetadataClass(rowData) {
	        if (this.hasRowMetadata() && this.rowMetadata.bodyCssClassName !== null && this.rowMetadata.bodyCssClassName !== undefined) {
	          if (typeof this.rowMetadata.bodyCssClassName === "function") {
	            return this.rowMetadata.bodyCssClassName(rowData);
	          } else {
	            return this.rowMetadata.bodyCssClassName;
	          }
	        }
	        return null;
	      },
	      writable: true,
	      configurable: true
	    },
	    getHeaderRowMetadataClass: {
	      value: function getHeaderRowMetadataClass() {
	        return this.hasRowMetadata() && this.rowMetadata.headerCssClassName !== null && this.rowMetadata.headerCssClassName !== undefined ? this.rowMetadata.headerCssClassName : null;
	      },
	      writable: true,
	      configurable: true
	    },
	    hasRowMetadata: {
	      value: function hasRowMetadata() {
	        return this.rowMetadata !== null;
	      },
	      writable: true,
	      configurable: true
	    }
	  });

	  return RowProperties;
	})();

	module.exports = RowProperties;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var ReactCSSTransitionGroup = __webpack_require__(17);
	var GridTitle = __webpack_require__(14);
	var GridRowContainer = __webpack_require__(15);
	var ColumnProperties = __webpack_require__(4);
	var RowProperties = __webpack_require__(5);
	var _ = __webpack_require__(3);

	var GridTable = React.createClass({
	  displayName: "GridTable",
	  getDefaultProps: function () {
	    return {
	      data: [],
	      columnSettings: null,
	      rowSettings: null,
	      sortSettings: null,
	      multipleSelectionSettings: null,
	      className: "",
	      enableInfiniteScroll: false,
	      nextPage: null,
	      hasMorePages: false,
	      useFixedHeader: false,
	      useFixedLayout: true,
	      paddingHeight: null,
	      rowHeight: null,
	      infiniteScrollLoadTreshold: null,
	      bodyHeight: null,
	      tableHeading: "",
	      useGriddleStyles: true,
	      useGriddleIcons: true,
	      isSubGriddle: false,
	      parentRowCollapsedClassName: "parent-row",
	      parentRowExpandedClassName: "parent-row expanded",
	      parentRowCollapsedComponent: "▶",
	      parentRowExpandedComponent: "▼",
	      externalLoadingComponent: null,
	      externalIsLoading: false,
	      onRowClick: null,
	      transitionName: null };
	  },
	  getInitialState: function () {
	    return {
	      scrollTop: 0,
	      scrollHeight: this.props.bodyHeight,
	      clientHeight: this.props.bodyHeight
	    };
	  },
	  componentDidMount: function () {
	    // After the initial render, see if we need to load additional pages.
	    this.gridScroll();
	  },
	  componentDidUpdate: function (prevProps, prevState) {
	    // After the subsequent renders, see if we need to load additional pages.
	    this.gridScroll();
	  },
	  gridScroll: function () {
	    if (this.props.enableInfiniteScroll && !this.props.externalIsLoading) {
	      // If the scroll height is greater than the current amount of rows displayed, update the page.
	      var scrollable = this.refs.scrollable.getDOMNode();
	      var scrollTop = scrollable.scrollTop;
	      var scrollHeight = scrollable.scrollHeight;
	      var clientHeight = scrollable.clientHeight;

	      // If the scroll position changed and the difference is greater than a row height
	      if (this.props.rowHeight !== null && this.state.scrollTop !== scrollTop && Math.abs(this.state.scrollTop - scrollTop) >= this.getAdjustedRowHeight()) {
	        var newState = {
	          scrollTop: scrollTop,
	          scrollHeight: scrollHeight,
	          clientHeight: clientHeight
	        };

	        // Set the state to the new state
	        this.setState(newState);
	      }

	      // Determine the diff by subtracting the amount scrolled by the total height, taking into consideratoin
	      // the spacer's height.
	      var scrollHeightDiff = scrollHeight - (scrollTop + clientHeight) - this.props.infiniteScrollLoadTreshold;

	      // Make sure that we load results a little before reaching the bottom.
	      var compareHeight = scrollHeightDiff * 0.6;

	      if (compareHeight <= this.props.infiniteScrollLoadTreshold) {
	        this.props.nextPage();
	      }
	    }
	  },
	  verifyProps: function () {
	    if (this.props.columnSettings === null) {
	      console.error("gridTable: The columnSettings prop is null and it shouldn't be");
	    }
	    if (this.props.rowSettings === null) {
	      console.error("gridTable: The rowSettings prop is null and it shouldn't be");
	    }
	  },
	  getAdjustedRowHeight: function () {
	    return this.props.rowHeight + this.props.paddingHeight * 2; // account for padding.
	  },
	  getNodeContent: function () {
	    this.verifyProps();
	    var that = this;

	    //figure out if we need to wrap the group in one tbody or many
	    var anyHasChildren = false;

	    // If the data is still being loaded, don't build the nodes unless this is an infinite scroll table.
	    if (!this.props.externalIsLoading || this.props.enableInfiniteScroll) {
	      var nodeData = that.props.data;
	      var aboveSpacerRow = null;
	      var belowSpacerRow = null;
	      var usingDefault = false;

	      // If we have a row height specified, only render what's going to be visible.
	      if (this.props.enableInfiniteScroll && this.props.rowHeight !== null && this.refs.scrollable !== undefined) {
	        var adjustedHeight = that.getAdjustedRowHeight();
	        var visibleRecordCount = Math.ceil(that.state.clientHeight / adjustedHeight);

	        // Inspired by : http://jsfiddle.net/vjeux/KbWJ2/9/
	        var displayStart = Math.max(0, Math.floor(that.state.scrollTop / adjustedHeight) - visibleRecordCount * 0.25);
	        var displayEnd = Math.min(displayStart + visibleRecordCount * 1.25, this.props.data.length - 1);

	        // Split the amount of nodes.
	        nodeData = nodeData.slice(displayStart, displayEnd + 1);

	        // Set the above and below nodes.
	        var aboveSpacerRowStyle = { height: displayStart * adjustedHeight + "px" };
	        aboveSpacerRow = React.createElement("tr", { key: "above-" + aboveSpacerRowStyle.height, style: aboveSpacerRowStyle });
	        var belowSpacerRowStyle = { height: (this.props.data.length - displayEnd) * adjustedHeight + "px" };
	        belowSpacerRow = React.createElement("tr", { key: "below-" + belowSpacerRowStyle.height, style: belowSpacerRowStyle });
	      }

	      var nodes = nodeData.map(function (row, index) {
	        var hasChildren = typeof row.children !== "undefined" && row.children.length > 0;
	        var uniqueId = that.props.rowSettings.getRowKey(row);

	        //at least one item in the group has children.
	        if (hasChildren) {
	          anyHasChildren = hasChildren;
	        }

	        return React.createElement(GridRowContainer, { useGriddleStyles: that.props.useGriddleStyles, isSubGriddle: that.props.isSubGriddle,
	          parentRowExpandedClassName: that.props.parentRowExpandedClassName, parentRowCollapsedClassName: that.props.parentRowCollapsedClassName,
	          parentRowExpandedComponent: that.props.parentRowExpandedComponent, parentRowCollapsedComponent: that.props.parentRowCollapsedComponent,
	          data: row, key: uniqueId + "-container", uniqueId: uniqueId, columnSettings: that.props.columnSettings, rowSettings: that.props.rowSettings, paddingHeight: that.props.paddingHeight,
	          multipleSelectionSettings: that.props.multipleSelectionSettings,
	          rowHeight: that.props.rowHeight, hasChildren: hasChildren, tableClassName: that.props.className, onRowClick: that.props.onRowClick });
	      });

	      // Add the spacer rows for nodes we're not rendering.
	      if (aboveSpacerRow) {
	        nodes.unshift(aboveSpacerRow);
	      }
	      if (belowSpacerRow) {
	        nodes.push(belowSpacerRow);
	      }

	      // Send back the nodes.
	      return {
	        nodes: nodes,
	        anyHasChildren: anyHasChildren
	      };
	    } else {
	      return null;
	    }
	  },
	  render: function () {
	    var that = this;
	    var nodes = [];

	    // for if we need to wrap the group in one tbody or many
	    var anyHasChildren = false;

	    // Grab the nodes to render
	    var nodeContent = this.getNodeContent();
	    if (nodeContent) {
	      nodes = nodeContent.nodes;
	      anyHasChildren = nodeContent.anyHasChildren;
	    }

	    var gridStyle = null;
	    var loadingContent = null;
	    var tableStyle = {
	      width: "100%"
	    };

	    if (this.props.useFixedLayout) {
	      tableStyle.tableLayout = "fixed";
	    }

	    if (this.props.enableInfiniteScroll) {
	      // If we're enabling infinite scrolling, we'll want to include the max height of the grid body + allow scrolling.
	      gridStyle = {
	        position: "relative",
	        overflowY: "scroll",
	        height: this.props.bodyHeight + "px",
	        width: "100%"
	      };
	    }

	    // If we're currently loading, populate the loading content
	    if (this.props.externalIsLoading) {
	      var defaultLoadingStyle = null;
	      var defaultColSpan = null;

	      if (this.props.useGriddleStyles) {
	        defaultLoadingStyle = {
	          textAlign: "center",
	          paddingBottom: "40px"
	        };

	        defaultColSpan = this.props.columnSettings.getVisibleColumnCount();
	      }

	      var loadingComponent = this.props.externalLoadingComponent ? React.createElement(this.props.externalLoadingComponent, null) : React.createElement(
	        "div",
	        null,
	        "Loading..."
	      );

	      loadingContent = React.createElement(
	        "tbody",
	        null,
	        React.createElement(
	          "tr",
	          null,
	          React.createElement(
	            "td",
	            { style: defaultLoadingStyle, colSpan: defaultColSpan },
	            loadingComponent
	          )
	        )
	      );
	    }

	    //construct the table heading component
	    var tableHeading = this.props.showTableHeading ? React.createElement(GridTitle, { useGriddleStyles: this.props.useGriddleStyles, useGriddleIcons: this.props.useGriddleIcons,
	      sortSettings: this.props.sortSettings,
	      multipleSelectionSettings: this.props.multipleSelectionSettings,
	      columnSettings: this.props.columnSettings,
	      rowSettings: this.props.rowSettings }) : "";

	    //check to see if any of the rows have children... if they don't wrap everything in a tbody so the browser doesn't auto do this
	    if (!anyHasChildren) {
	      if (that.props.transitionName) {
	        nodes = React.createElement(
	          ReactCSSTransitionGroup,
	          { component: "tbody", transitionName: that.props.transitionName },
	          nodes
	        );
	      } else {
	        nodes = React.createElement(
	          "tbody",
	          null,
	          nodes
	        );
	      }
	    }

	    var pagingContent = "";
	    if (this.props.showPager) {
	      var pagingStyles = this.props.useGriddleStyles ? {
	        padding: "0",
	        backgroundColor: "#EDEDED",
	        border: "0",
	        color: "#222"
	      } : null;
	      pagingContent = React.createElement(
	        "tbody",
	        null,
	        React.createElement(
	          "tr",
	          null,
	          React.createElement(
	            "td",
	            { colSpan: this.props.multipleSelectionSettings.isMultipleSelection ? this.props.columnSettings.getVisibleColumnCount() + 1 : this.props.columnSettings.getVisibleColumnCount(), style: pagingStyles, className: "footer-container" },
	            this.props.pagingContent
	          )
	        )
	      );
	    }

	    // If we have a fixed header, split into two tables.
	    if (this.props.useFixedHeader) {
	      if (this.props.useGriddleStyles) {
	        tableStyle.tableLayout = "fixed";
	      }

	      return React.createElement(
	        "div",
	        null,
	        React.createElement(
	          "table",
	          { className: this.props.className, style: this.props.useGriddleStyles && tableStyle || null },
	          tableHeading
	        ),
	        React.createElement(
	          "div",
	          { ref: "scrollable", onScroll: this.gridScroll, style: gridStyle },
	          React.createElement(
	            "table",
	            { className: this.props.className, style: this.props.useGriddleStyles && tableStyle || null },
	            nodes,
	            loadingContent,
	            pagingContent
	          )
	        )
	      );
	    }

	    return React.createElement(
	      "div",
	      { ref: "scrollable", onScroll: this.gridScroll, style: gridStyle },
	      React.createElement(
	        "table",
	        { className: this.props.className, style: this.props.useGriddleStyles && tableStyle || null },
	        tableHeading,
	        nodes,
	        loadingContent,
	        pagingContent
	      )
	    );
	  }
	});

	module.exports = GridTable;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);

	var GridFilter = React.createClass({
	    displayName: "GridFilter",
	    getDefaultProps: function () {
	        return {
	            placeholderText: ""
	        };
	    },
	    handleChange: function (event) {
	        this.props.changeFilter(event.target.value);
	    },
	    render: function () {
	        return React.createElement(
	            "div",
	            { className: "filter-container" },
	            React.createElement("input", { type: "text", name: "filter", placeholder: this.props.placeholderText, className: "form-control", onChange: this.handleChange })
	        );
	    }
	});

	module.exports = GridFilter;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);

	//needs props maxPage, currentPage, nextFunction, prevFunction
	var GridPagination = React.createClass({
	    displayName: "GridPagination",
	    getDefaultProps: function () {
	        return {
	            maxPage: 0,
	            nextText: "",
	            previousText: "",
	            currentPage: 0,
	            useGriddleStyles: true,
	            nextClassName: "griddle-next",
	            previousClassName: "griddle-previous",
	            nextIconComponent: null,
	            previousIconComponent: null
	        };
	    },
	    pageChange: function (event) {
	        this.props.setPage(parseInt(event.target.value, 10) - 1);
	    },
	    render: function () {
	        var previous = "";
	        var next = "";

	        if (this.props.currentPage > 0) {
	            previous = React.createElement(
	                "button",
	                { type: "button", onClick: this.props.previous, style: this.props.useGriddleStyles ? { color: "#222", border: "none", background: "none", margin: "0 0 0 10px" } : null },
	                this.props.previousIconComponent,
	                this.props.previousText
	            );
	        }

	        if (this.props.currentPage !== this.props.maxPage - 1) {
	            next = React.createElement(
	                "button",
	                { type: "button", onClick: this.props.next, style: this.props.useGriddleStyles ? { color: "#222", border: "none", background: "none", margin: "0 10px 0 0" } : null },
	                this.props.nextText,
	                this.props.nextIconComponent
	            );
	        }

	        var leftStyle = null;
	        var middleStyle = null;
	        var rightStyle = null;

	        if (this.props.useGriddleStyles === true) {
	            var baseStyle = {
	                float: "left",
	                minHeight: "1px",
	                marginTop: "5px"
	            };

	            rightStyle = _.extend({ textAlign: "right", width: "34%" }, baseStyle);
	            middleStyle = _.extend({ textAlign: "center", width: "33%" }, baseStyle);
	            leftStyle = _.extend({ width: "33%" }, baseStyle);
	        }

	        var options = [];

	        for (var i = 1; i <= this.props.maxPage; i++) {
	            options.push(React.createElement(
	                "option",
	                { value: i, key: i },
	                i
	            ));
	        }

	        return React.createElement(
	            "div",
	            { style: this.props.useGriddleStyles ? { minHeight: "35px" } : null },
	            React.createElement(
	                "div",
	                { className: this.props.previousClassName, style: leftStyle },
	                previous
	            ),
	            React.createElement(
	                "div",
	                { className: "griddle-page", style: middleStyle },
	                React.createElement(
	                    "select",
	                    { value: this.props.currentPage + 1, onChange: this.pageChange },
	                    options
	                ),
	                " / ",
	                this.props.maxPage
	            ),
	            React.createElement(
	                "div",
	                { className: this.props.nextClassName, style: rightStyle },
	                next
	            )
	        );
	    }
	});

	module.exports = GridPagination;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);

	var GridSettings = React.createClass({
	    displayName: "GridSettings",
	    getDefaultProps: function () {
	        return {
	            columns: [],
	            columnMetadata: [],
	            selectedColumns: [],
	            settingsText: "",
	            maxRowsText: "",
	            resultsPerPage: 0,
	            enableToggleCustom: false,
	            useCustomComponent: false,
	            useGriddleStyles: true,
	            toggleCustomComponent: function () {}
	        };
	    },
	    setPageSize: function (event) {
	        var value = parseInt(event.target.value, 10);
	        this.props.setPageSize(value);
	    },
	    handleChange: function (event) {
	        var columnName = event.target.dataset ? event.target.dataset.name : event.target.getAttribute("data-name");
	        if (event.target.checked === true && _.contains(this.props.selectedColumns, columnName) === false) {
	            this.props.selectedColumns.push(columnName);
	            this.props.setColumns(this.props.selectedColumns);
	        } else {
	            /* redraw with the selected columns minus the one just unchecked */
	            this.props.setColumns(_.without(this.props.selectedColumns, columnName));
	        }
	    },
	    render: function () {
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
	                    return React.createElement(
	                        "div",
	                        { className: "column checkbox" },
	                        React.createElement(
	                            "label",
	                            null,
	                            React.createElement("input", { type: "checkbox", disabled: true, name: "check", checked: checked, "data-name": col }),
	                            displayName
	                        )
	                    );
	                } else if (typeof meta !== "undefined" && meta != null && typeof meta.visible !== "undefined" && meta.visible === false) {
	                    return null;
	                }
	                return React.createElement(
	                    "div",
	                    { className: "griddle-column-selection checkbox", key: col, style: that.props.useGriddleStyles ? { float: "left", width: "20%" } : null },
	                    React.createElement(
	                        "label",
	                        null,
	                        React.createElement("input", { type: "checkbox", name: "check", onChange: that.handleChange, checked: checked, "data-name": col }),
	                        displayName
	                    )
	                );
	            });
	        }

	        var toggleCustom = that.props.enableToggleCustom ? React.createElement(
	            "div",
	            { className: "form-group" },
	            React.createElement(
	                "label",
	                { htmlFor: "maxRows" },
	                React.createElement("input", { type: "checkbox", checked: this.props.useCustomComponent, onChange: this.props.toggleCustomComponent }),
	                " ",
	                this.props.enableCustomFormatText
	            )
	        ) : "";

	        var setPageSize = this.props.showSetPageSize ? React.createElement(
	            "div",
	            null,
	            React.createElement(
	                "label",
	                { htmlFor: "maxRows" },
	                this.props.maxRowsText,
	                ":",
	                React.createElement(
	                    "select",
	                    { onChange: this.setPageSize, value: this.props.resultsPerPage },
	                    React.createElement(
	                        "option",
	                        { value: "5" },
	                        "5"
	                    ),
	                    React.createElement(
	                        "option",
	                        { value: "10" },
	                        "10"
	                    ),
	                    React.createElement(
	                        "option",
	                        { value: "25" },
	                        "25"
	                    ),
	                    React.createElement(
	                        "option",
	                        { value: "50" },
	                        "50"
	                    ),
	                    React.createElement(
	                        "option",
	                        { value: "100" },
	                        "100"
	                    )
	                )
	            )
	        ) : "";


	        return React.createElement(
	            "div",
	            { className: "griddle-settings", style: this.props.useGriddleStyles ? { backgroundColor: "#FFF", border: "1px solid #DDD", color: "#222", padding: "10px", marginBottom: "10px" } : null },
	            React.createElement(
	                "h6",
	                null,
	                this.props.settingsText
	            ),
	            React.createElement(
	                "div",
	                { className: "griddle-columns", style: this.props.useGriddleStyles ? { clear: "both", display: "table", width: "100%", borderBottom: "1px solid #EDEDED", marginBottom: "10px" } : null },
	                nodes
	            ),
	            setPageSize,
	            toggleCustom
	        );
	    }
	});

	module.exports = GridSettings;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);

	var GridNoData = React.createClass({
	    displayName: "GridNoData",
	    getDefaultProps: function () {
	        return {
	            noDataMessage: "No Data"
	        };
	    },
	    render: function () {
	        var that = this;

	        return React.createElement(
	            "div",
	            null,
	            this.props.noDataMessage
	        );
	    }
	});

	module.exports = GridNoData;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);
	var ColumnProperties = __webpack_require__(4);
	var powerPick = __webpack_require__(16);

	var GridRow = React.createClass({
	  displayName: "GridRow",
	  getDefaultProps: function () {
	    return {
	      isChildRow: false,
	      showChildren: false,
	      data: {},
	      columnSettings: null,
	      rowSettings: null,
	      hasChildren: false,
	      useGriddleStyles: true,
	      useGriddleIcons: true,
	      isSubGriddle: false,
	      paddingHeight: null,
	      rowHeight: null,
	      parentRowCollapsedClassName: "parent-row",
	      parentRowExpandedClassName: "parent-row expanded",
	      parentRowCollapsedComponent: "▶",
	      parentRowExpandedComponent: "▼",
	      onRowClick: null,
	      multipleSelectionSettings: null
	    };
	  },
	  handleClick: function (e) {
	    if (this.props.onRowClick !== null && _.isFunction(this.props.onRowClick)) {
	      this.props.onRowClick(this, e);
	    } else if (this.props.hasChildren) {
	      this.props.toggleChildren();
	    }
	  },
	  handleSelectionChange: function (e) {
	    //hack to get around warning that's not super useful in this case
	    return;
	  },
	  handleSelectClick: function (e) {
	    if (this.props.multipleSelectionSettings.isMultipleSelection) {
	      if (e.target.type === "checkbox") {
	        this.props.multipleSelectionSettings.toggleSelectRow(this.props.data, this.refs.selected.getDOMNode().checked);
	      } else {
	        this.props.multipleSelectionSettings.toggleSelectRow(this.props.data, !this.refs.selected.getDOMNode().checked);
	      }
	    }
	  },
	  verifyProps: function () {
	    if (this.props.columnSettings === null) {
	      console.error("gridRow: The columnSettings prop is null and it shouldn't be");
	    }
	  },
	  render: function () {
	    var _this = this;
	    this.verifyProps();
	    var that = this;
	    var columnStyles = null;

	    if (this.props.useGriddleStyles) {
	      columnStyles = {
	        margin: "0",
	        padding: that.props.paddingHeight + "px 5px " + that.props.paddingHeight + "px 5px",
	        height: that.props.rowHeight ? this.props.rowHeight - that.props.paddingHeight * 2 + "px" : null,
	        backgroundColor: "#FFF",
	        borderTopColor: "#DDD",
	        color: "#222"
	      };
	    }

	    var columns = this.props.columnSettings.getColumns();

	    // make sure that all the columns we need have default empty values
	    // otherwise they will get clipped
	    var defaults = _.object(columns, []);

	    // creates a 'view' on top the data so we will not alter the original data but will allow us to add default values to missing columns
	    var dataView = Object.create(this.props.data);

	    _.defaults(dataView, defaults);

	    var data = _.pairs(powerPick(dataView, columns));

	    var nodes = data.map(function (col, index) {
	      var returnValue = null;
	      var meta = _this.props.columnSettings.getColumnMetadataByName(col[0]);

	      //todo: Make this not as ridiculous looking
	      var firstColAppend = index === 0 && _this.props.hasChildren && _this.props.showChildren === false && _this.props.useGriddleIcons ? React.createElement(
	        "span",
	        { style: _this.props.useGriddleStyles ? { fontSize: "10px", marginRight: "5px" } : null },
	        _this.props.parentRowCollapsedComponent
	      ) : index === 0 && _this.props.hasChildren && _this.props.showChildren && _this.props.useGriddleIcons ? React.createElement(
	        "span",
	        { style: _this.props.useGriddleStyles ? { fontSize: "10px" } : null },
	        _this.props.parentRowExpandedComponent
	      ) : "";

	      if (index === 0 && _this.props.isChildRow && _this.props.useGriddleStyles) {
	        columnStyles = _.extend(columnStyles, { paddingLeft: 10 });
	      }

	      if (_this.props.columnSettings.hasColumnMetadata() && typeof meta !== "undefined") {
	        var colData = typeof meta.customComponent === "undefined" || meta.customComponent === null ? col[1] : React.createElement(meta.customComponent, { data: col[1], rowData: dataView, metadata: meta });
	        returnValue = meta == null ? returnValue : React.createElement(
	          "td",
	          { onClick: _this.handleClick, className: meta.cssClassName, key: index, style: columnStyles },
	          colData
	        );
	      }

	      return returnValue || React.createElement(
	        "td",
	        { onClick: _this.handleClick, key: index, style: columnStyles },
	        firstColAppend,
	        col[1]
	      );
	    });

	    if (nodes && this.props.multipleSelectionSettings && this.props.multipleSelectionSettings.isMultipleSelection) {
	      var selectedRowIds = this.props.multipleSelectionSettings.getSelectedRowIds();

	      nodes.unshift(React.createElement(
	        "td",
	        { key: "selection", style: columnStyles },
	        React.createElement("input", {
	          type: "checkbox",
	          checked: this.props.multipleSelectionSettings.getIsRowChecked(dataView),
	          onChange: this.handleSelectionChange,
	          ref: "selected" })
	      ));
	    }

	    //Get the row from the row settings.
	    var className = that.props.rowSettings && that.props.rowSettings.getBodyRowMetadataClass(that.props.data) || "standard-row";

	    if (that.props.isChildRow) {
	      className = "child-row";
	    } else if (that.props.hasChildren) {
	      className = that.props.showChildren ? this.props.parentRowExpandedClassName : this.props.parentRowCollapsedClassName;
	    }
	    return React.createElement(
	      "tr",
	      { onClick: this.props.multipleSelectionSettings && this.props.multipleSelectionSettings.isMultipleSelection ? this.handleSelectClick : null, className: className },
	      nodes
	    );
	  }
	});

	module.exports = GridRow;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);

	var CustomRowComponentContainer = React.createClass({
	  displayName: "CustomRowComponentContainer",
	  getDefaultProps: function () {
	    return {
	      data: [],
	      metadataColumns: [],
	      className: "",
	      customComponent: {}
	    };
	  },
	  render: function () {
	    var that = this;

	    if (typeof that.props.customComponent !== "function") {
	      console.log("Couldn't find valid template.");
	      return React.createElement("div", { className: this.props.className });
	    }

	    var nodes = this.props.data.map(function (row, index) {
	      return React.createElement(that.props.customComponent, { data: row, metadataColumns: that.props.metadataColumns, key: index });
	    });

	    var footer = this.props.showPager && this.props.pagingContent;
	    return React.createElement(
	      "div",
	      { className: this.props.className, style: this.props.style },
	      nodes
	    );
	  }
	});

	module.exports = CustomRowComponentContainer;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);

	var CustomPaginationContainer = React.createClass({
	  displayName: "CustomPaginationContainer",
	  getDefaultProps: function () {
	    return {
	      maxPage: 0,
	      nextText: "",
	      previousText: "",
	      currentPage: 0,
	      customPagerComponent: {}
	    };
	  },
	  render: function () {
	    var that = this;

	    if (typeof that.props.customPagerComponent !== "function") {
	      console.log("Couldn't find valid template.");
	      return React.createElement("div", null);
	    }

	    return React.createElement(that.props.customPagerComponent, { maxPage: this.props.maxPage, nextText: this.props.nextText, previousText: this.props.previousText, currentPage: this.props.currentPage, setPage: this.props.setPage, previous: this.props.previous, next: this.props.next });
	  }
	});

	module.exports = CustomPaginationContainer;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);
	var ColumnProperties = __webpack_require__(4);

	var GridTitle = React.createClass({
	    displayName: "GridTitle",
	    getDefaultProps: function () {
	        return {
	            columnSettings: null,
	            rowSettings: null,
	            sortSettings: null,
	            multipleSelectionSettings: null,
	            headerStyle: null,
	            useGriddleStyles: true,
	            useGriddleIcons: true,
	            headerStyles: {} };
	    },
	    componentWillMount: function () {
	        this.verifyProps();
	    },
	    sort: function (event) {
	        this.props.sortSettings.changeSort(event.target.dataset.title || event.target.parentElement.dataset.title);
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
	        var titleStyles = null;

	        var nodes = this.props.columnSettings.getColumns().map(function (col, index) {
	            var columnSort = "";
	            var sortComponent = null;

	            if (that.props.sortSettings.sortColumn == col && that.props.sortSettings.sortAscending) {
	                columnSort = that.props.sortSettings.sortAscendingClassName;
	                sortComponent = that.props.useGriddleIcons && that.props.sortSettings.sortAscendingComponent;
	            } else if (that.props.sortSettings.sortColumn == col && that.props.sortSettings.sortAscending === false) {
	                columnSort += that.props.sortSettings.sortDescendingClassName;
	                sortComponent = that.props.useGriddleIcons && that.props.sortSettings.sortDescendingComponent;
	            }


	            var meta = that.props.columnSettings.getColumnMetadataByName(col);
	            var columnIsSortable = that.props.columnSettings.getMetadataColumnProperty(col, "sortable", true);
	            var displayName = that.props.columnSettings.getMetadataColumnProperty(col, "displayName", col);

	            columnSort = meta == null ? columnSort : (columnSort && columnSort + " " || columnSort) + that.props.columnSettings.getMetadataColumnProperty(col, "cssClassName", "");

	            if (that.props.useGriddleStyles) {
	                titleStyles = {
	                    backgroundColor: "#EDEDEF",
	                    border: "0",
	                    borderBottom: "1px solid #DDD",
	                    color: "#222",
	                    padding: "5px",
	                    cursor: columnIsSortable ? "pointer" : "default"
	                };
	            }

	            return React.createElement(
	                "th",
	                { onClick: columnIsSortable ? that.sort : null, "data-title": col, className: columnSort, key: displayName, style: titleStyles },
	                displayName,
	                sortComponent
	            );
	        });

	        if (nodes && this.props.multipleSelectionSettings.isMultipleSelection) {
	            nodes.unshift(React.createElement(
	                "th",
	                { key: "selection", onClick: this.toggleSelectAll, style: titleStyles },
	                React.createElement("input", { type: "checkbox", checked: this.props.multipleSelectionSettings.getIsSelectAllChecked(), onChange: this.handleSelectionChange })
	            ));
	        }

	        //Get the row from the row settings.
	        var className = that.props.rowSettings && that.props.rowSettings.getHeaderRowMetadataClass() || null;

	        return React.createElement(
	            "thead",
	            null,
	            React.createElement(
	                "tr",
	                {
	                    className: className,
	                    style: this.props.headerStyles },
	                nodes
	            )
	        );
	    }
	});

	module.exports = GridTitle;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var ColumnProperties = __webpack_require__(4);

	var GridRowContainer = React.createClass({
	  displayName: "GridRowContainer",
	  getDefaultProps: function () {
	    return {
	      useGriddleStyles: true,
	      useGriddleIcons: true,
	      isSubGriddle: false,
	      columnSettings: null,
	      rowSettings: null,
	      paddingHeight: null,
	      rowHeight: null,
	      parentRowCollapsedClassName: "parent-row",
	      parentRowExpandedClassName: "parent-row expanded",
	      parentRowCollapsedComponent: "▶",
	      parentRowExpandedComponent: "▼",
	      onRowClick: null,
	      multipleSelectionSettings: null
	    };
	  },
	  getInitialState: function () {
	    return {
	      data: {},
	      showChildren: false
	    };
	  },
	  componentWillReceiveProps: function () {
	    this.setShowChildren(false);
	  },
	  toggleChildren: function () {
	    this.setShowChildren(this.state.showChildren === false);
	  },
	  setShowChildren: function (visible) {
	    this.setState({
	      showChildren: visible
	    });
	  },
	  verifyProps: function () {
	    if (this.props.columnSettings === null) {
	      console.error("gridRowContainer: The columnSettings prop is null and it shouldn't be");
	    }
	  },
	  render: function () {
	    this.verifyProps();
	    var that = this;
	    if (typeof this.props.data === "undefined") {
	      return React.createElement("tbody", null);
	    }
	    var arr = [];

	    var columns = this.props.columnSettings.getColumns();

	    arr.push(React.createElement(this.props.rowSettings.rowComponent, {
	      useGriddleStyles: this.props.useGriddleStyles,
	      isSubGriddle: this.props.isSubGriddle,
	      data: this.props.rowSettings.isCustom ? _.pick(this.props.data, columns) : this.props.data,
	      rowData: this.props.rowSettings.isCustom ? this.props.data : null,
	      columnSettings: this.props.columnSettings,
	      rowSettings: this.props.rowSettings,
	      hasChildren: that.props.hasChildren,
	      toggleChildren: that.toggleChildren,
	      showChildren: that.state.showChildren,
	      key: that.props.uniqueId,
	      useGriddleIcons: that.props.useGriddleIcons,
	      parentRowExpandedClassName: this.props.parentRowExpandedClassName,
	      parentRowCollapsedClassName: this.props.parentRowCollapsedClassName,
	      parentRowExpandedComponent: this.props.parentRowExpandedComponent,
	      parentRowCollapsedComponent: this.props.parentRowCollapsedComponent,
	      paddingHeight: that.props.paddingHeight,
	      rowHeight: that.props.rowHeight,
	      onRowClick: that.props.onRowClick,
	      multipleSelectionSettings: this.props.multipleSelectionSettings }));

	    var children = null;

	    if (that.state.showChildren) {
	      children = that.props.hasChildren && this.props.data.children.map(function (row, index) {
	        if (typeof row.children !== "undefined") {
	          var Griddle = __webpack_require__(1);
	          return React.createElement(
	            "tr",
	            { style: { paddingLeft: 5 } },
	            React.createElement(
	              "td",
	              { colSpan: that.props.columnSettings.getVisibleColumnCount(), className: "griddle-parent", style: that.props.useGriddleStyles ? { border: "none", padding: "0 0 0 5px" } : null },
	              React.createElement(Griddle, { isSubGriddle: true, results: [row], columns: that.props.columnSettings.getColumns(), tableClassName: that.props.tableClassName, parentRowExpandedClassName: that.props.parentRowExpandedClassName,
	                parentRowCollapsedClassName: that.props.parentRowCollapsedClassName,
	                showTableHeading: false, showPager: false, columnMetadata: that.props.columnMetadata,
	                parentRowExpandedComponent: that.props.parentRowExpandedComponent,
	                parentRowCollapsedComponent: that.props.parentRowCollapsedComponent,
	                paddingHeight: that.props.paddingHeight, rowHeight: that.props.rowHeight })
	            )
	          );
	        }

	        return React.createElement(that.props.rowSettings.rowComponent, { useGriddleStyles: that.props.useGriddleStyles, isSubGriddle: that.props.isSubGriddle, data: row, columnSettings: that.props.columnSettings, isChildRow: true, columnMetadata: that.props.columnMetadata, key: that.props.rowSettings.getRowKey(row) });
	      });
	    }

	    return that.props.hasChildren === false ? arr[0] : React.createElement(
	      "tbody",
	      null,
	      that.state.showChildren ? arr.concat(children) : arr
	    );
	  }
	});

	module.exports = GridRowContainer;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(3);

	// Credits: https://github.com/documentcloud/underscore-contrib
	// Sub module: underscore.object.selectors
	// License: MIT (https://github.com/documentcloud/underscore-contrib/blob/master/LICENSE)
	// https://github.com/documentcloud/underscore-contrib/blob/master/underscore.object.selectors.js

	// Will take a path like 'element[0][1].subElement["Hey!.What?"]["[hey]"]'
	// and return ["element", "0", "1", "subElement", "Hey!.What?", "[hey]"]
	function keysFromPath(path) {
	  // from http://codereview.stackexchange.com/a/63010/8176
	  /**
	   * Repeatedly capture either:
	   * - a bracketed expression, discarding optional matching quotes inside, or
	   * - an unbracketed expression, delimited by a dot or a bracket.
	   */
	  var re = /\[("|')(.+)\1\]|([^.\[\]]+)/g;

	  var elements = [];
	  var result;
	  while ((result = re.exec(path)) !== null) {
	    elements.push(result[2] || result[3]);
	  }
	  return elements;
	}

	// Gets the value at any depth in a nested object based on the
	// path described by the keys given. Keys may be given as an array
	// or as a dot-separated string.
	function getPath(obj, ks) {
	  ks = typeof ks == "string" ? keysFromPath(ks) : ks;

	  var i = -1,
	      length = ks.length;

	  // If the obj is null or undefined we have to break as
	  // a TypeError will result trying to access any property
	  // Otherwise keep incrementally access the next property in
	  // ks until complete
	  while (++i < length && obj != null) {
	    obj = obj[ks[i]];
	  }
	  return i === length ? obj : void 0;
	}


	// Based on the origin underscore _.pick function
	// Credit: https://github.com/jashkenas/underscore/blob/master/underscore.js
	module.exports = function (object, keys) {
	  var result = {},
	      obj = object,
	      iteratee;
	  iteratee = function (key, obj) {
	    return key in obj;
	  };

	  obj = Object(obj);

	  for (var i = 0, length = keys.length; i < length; i++) {
	    var key = keys[i];
	    if (iteratee(key, obj)) result[key] = getPath(obj, key);
	  }

	  return result;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(18);

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var ReactTransitionChildMapping = __webpack_require__(19);
	var CSSTransitionGroupChild = __webpack_require__(20);

	var CSSTransitionGroup = React.createClass({
	  displayName: 'CSSTransitionGroup',

	  protoTypes: {
	    component: React.PropTypes.any,
	    transitionName: React.PropTypes.string.isRequired,
	    transitionEnter: React.PropTypes.bool,
	    transitionLeave: React.PropTypes.bool
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      component: 'span',
	      transitionEnter: true,
	      transitionLeave: true
	    };
	  },

	  getInitialState: function getInitialState() {
	    var ret = [];
	    React.Children.forEach(this.props.children, function (c) {
	      ret.push(c);
	    });
	    return {
	      children: ret
	    };
	  },

	  componentWillMount: function componentWillMount() {
	    this.currentlyTransitioningKeys = {};
	    this.keysToEnter = [];
	    this.keysToLeave = [];
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    var _this = this;

	    var nextChildMapping = [];
	    var showProp = this.props.showProp;
	    var exclusive = this.props.exclusive;

	    React.Children.forEach(nextProps.children, function (c) {
	      nextChildMapping.push(c);
	    });

	    // // last props children if exclusive
	    var prevChildMapping = exclusive ? this.props.children : this.state.children;

	    var newChildren = ReactTransitionChildMapping.mergeChildMappings(prevChildMapping, nextChildMapping);

	    if (showProp) {
	      newChildren = newChildren.map(function (c) {
	        if (!c.props[showProp] && ReactTransitionChildMapping.isShownInChildren(prevChildMapping, c, showProp)) {
	          var newProps = {};
	          newProps[showProp] = true;
	          c = React.cloneElement(c, newProps);
	        }
	        return c;
	      });
	    }

	    if (exclusive) {
	      // make middle state children invalid
	      // restore to last props children
	      newChildren.forEach(function (c) {
	        _this.stop(c.key);
	      });
	    }

	    this.setState({
	      children: newChildren
	    });

	    nextChildMapping.forEach(function (c) {
	      var key = c.key;
	      var hasPrev = prevChildMapping && ReactTransitionChildMapping.inChildren(prevChildMapping, c);
	      if (showProp) {
	        if (hasPrev) {
	          var showInPrev = ReactTransitionChildMapping.isShownInChildren(prevChildMapping, c, showProp);
	          var showInNow = c.props[showProp];
	          if (!showInPrev && showInNow && !_this.currentlyTransitioningKeys[key]) {
	            _this.keysToEnter.push(key);
	          }
	        }
	      } else if (!hasPrev && !_this.currentlyTransitioningKeys[key]) {
	        _this.keysToEnter.push(key);
	      }
	    });

	    prevChildMapping.forEach(function (c) {
	      var key = c.key;
	      var hasNext = nextChildMapping && ReactTransitionChildMapping.inChildren(nextChildMapping, c);
	      if (showProp) {
	        if (hasNext) {
	          var showInNext = ReactTransitionChildMapping.isShownInChildren(nextChildMapping, c, showProp);
	          var showInNow = c.props[showProp];
	          if (!showInNext && showInNow && !_this.currentlyTransitioningKeys[key]) {
	            _this.keysToLeave.push(key);
	          }
	        }
	      } else if (!hasNext && !_this.currentlyTransitioningKeys[key]) {
	        _this.keysToLeave.push(key);
	      }
	    });
	  },

	  performEnter: function performEnter(key) {
	    this.currentlyTransitioningKeys[key] = true;
	    var component = this.refs[key];
	    if (component.componentWillEnter) {
	      component.componentWillEnter(this._handleDoneEntering.bind(this, key));
	    } else {
	      this._handleDoneEntering(key);
	    }
	  },

	  _handleDoneEntering: function _handleDoneEntering(key) {
	    //console.log('_handleDoneEntering, ', key);
	    delete this.currentlyTransitioningKeys[key];
	    var currentChildMapping = this.props.children;
	    var showProp = this.props.showProp;
	    if (!currentChildMapping || !showProp && !ReactTransitionChildMapping.inChildrenByKey(currentChildMapping, key) || showProp && !ReactTransitionChildMapping.isShownInChildrenByKey(currentChildMapping, key, showProp)) {
	      // This was removed before it had fully entered. Remove it.
	      //console.log('releave ',key);
	      this.performLeave(key);
	    } else {
	      this.setState({ children: currentChildMapping });
	    }
	  },

	  stop: function stop(key) {
	    delete this.currentlyTransitioningKeys[key];
	    var component = this.refs[key];
	    if (component) {
	      component.stop();
	    }
	  },

	  performLeave: function performLeave(key) {
	    this.currentlyTransitioningKeys[key] = true;

	    var component = this.refs[key];
	    if (component.componentWillLeave) {
	      component.componentWillLeave(this._handleDoneLeaving.bind(this, key));
	    } else {
	      // Note that this is somewhat dangerous b/c it calls setState()
	      // again, effectively mutating the component before all the work
	      // is done.
	      this._handleDoneLeaving(key);
	    }
	  },

	  _handleDoneLeaving: function _handleDoneLeaving(key) {
	    //console.log('_handleDoneLeaving, ', key);
	    delete this.currentlyTransitioningKeys[key];
	    var showProp = this.props.showProp;
	    var currentChildMapping = this.props.children;
	    if (showProp && currentChildMapping && ReactTransitionChildMapping.isShownInChildrenByKey(currentChildMapping, key, showProp)) {
	      this.performEnter(key);
	    } else if (!showProp && currentChildMapping && ReactTransitionChildMapping.inChildrenByKey(currentChildMapping, key)) {
	      // This entered again before it fully left. Add it again.
	      //console.log('reenter ',key);
	      this.performEnter(key);
	    } else {
	      this.setState({ children: currentChildMapping });
	    }
	  },

	  componentDidUpdate: function componentDidUpdate() {
	    var keysToEnter = this.keysToEnter;
	    this.keysToEnter = [];
	    keysToEnter.forEach(this.performEnter);
	    var keysToLeave = this.keysToLeave;
	    this.keysToLeave = [];
	    keysToLeave.forEach(this.performLeave);
	  },

	  render: function render() {
	    var props = this.props;
	    var children = this.state.children.map(function (child) {
	      return React.createElement(
	        CSSTransitionGroupChild,
	        {
	          key: child.key,
	          ref: child.key,
	          name: props.transitionName,
	          enter: props.transitionEnter,
	          leave: props.transitionLeave },
	        child
	      );
	    });
	    var Component = this.props.component;
	    return React.createElement(
	      Component,
	      this.props,
	      children
	    );
	  }
	});
	module.exports = CSSTransitionGroup;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function inChildren(children, child) {
	  var found = 0;
	  children.forEach(function (c) {
	    if (found) {
	      return;
	    }
	    found = c.key === child.key;
	  });
	  return found;
	}

	module.exports = {
	  inChildren: inChildren,

	  isShownInChildren: function isShownInChildren(children, child, showProp) {
	    var found = 0;
	    children.forEach(function (c) {
	      if (found) {
	        return;
	      }
	      found = c.key === child.key && c.props[showProp];
	    });
	    return found;
	  },

	  inChildrenByKey: function inChildrenByKey(children, key) {
	    var found = 0;
	    children.forEach(function (c) {
	      if (found) {
	        return;
	      }
	      found = c.key === key;
	    });
	    return found;
	  },

	  isShownInChildrenByKey: function isShownInChildrenByKey(children, key, showProp) {
	    var found = 0;
	    children.forEach(function (c) {
	      if (found) {
	        return;
	      }
	      found = c.key === key && c.props[showProp];
	    });
	    return found;
	  },

	  mergeChildMappings: function mergeChildMappings(prev, next) {
	    var ret = [];

	    // For each key of `next`, the list of keys to insert before that key in
	    // the combined list
	    var nextChildrenPending = {};
	    var pendingChildren = [];
	    prev.forEach(function (c) {
	      if (inChildren(next, c)) {
	        if (pendingChildren.length) {
	          nextChildrenPending[c.key] = pendingChildren;
	          pendingChildren = [];
	        }
	      } else {
	        pendingChildren.push(c);
	      }
	    });

	    next.forEach(function (c) {
	      if (nextChildrenPending.hasOwnProperty(c.key)) {
	        ret = ret.concat(nextChildrenPending[c.key]);
	      }
	      ret.push(c);
	    });

	    ret = ret.concat(pendingChildren);

	    return ret;
	  }
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 * @providesModule ReactCSSTransitionGroupChild
	 */

	'use strict';

	var React = __webpack_require__(2);

	var CSSCore = __webpack_require__(21);
	var ReactTransitionEvents = __webpack_require__(22);

	var TICK = 17;

	var ReactCSSTransitionGroupChild = React.createClass({
	  displayName: 'ReactCSSTransitionGroupChild',

	  transition: function transition(animationType, finishCallback) {
	    var _this = this;

	    var node = this.getDOMNode();
	    var className = this.props.name + '-' + animationType;
	    var activeClassName = className + '-active';

	    if (this.endListener) {
	      this.endListener();
	    }

	    this.endListener = function (e) {
	      if (e && e.target !== node) {
	        return;
	      }

	      CSSCore.removeClass(node, className);
	      CSSCore.removeClass(node, activeClassName);

	      ReactTransitionEvents.removeEndEventListener(node, _this.endListener);
	      _this.endListener = null;

	      // Usually this optional callback is used for informing an owner of
	      // a leave animation and telling it to remove the child.
	      if (finishCallback) {
	        finishCallback();
	      }
	    };

	    ReactTransitionEvents.addEndEventListener(node, this.endListener);

	    CSSCore.addClass(node, className);

	    // Need to do this to actually trigger a transition.
	    this.queueClass(activeClassName);
	  },

	  queueClass: function queueClass(className) {
	    this.classNameQueue.push(className);

	    if (!this.timeout) {
	      this.timeout = setTimeout(this.flushClassNameQueue, TICK);
	    }
	  },

	  stop: function stop() {
	    //console.log('force stop')
	    if (this.timeout) {
	      clearTimeout(this.timeout);
	      this.classNameQueue.length = 0;
	      this.timeout = null;
	    }
	    if (this.endListener) {
	      this.endListener();
	    }
	  },

	  flushClassNameQueue: function flushClassNameQueue() {
	    if (this.isMounted()) {
	      this.classNameQueue.forEach(CSSCore.addClass.bind(CSSCore, this.getDOMNode()));
	    }
	    this.classNameQueue.length = 0;
	    this.timeout = null;
	  },

	  componentWillMount: function componentWillMount() {
	    this.classNameQueue = [];
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    if (this.timeout) {
	      clearTimeout(this.timeout);
	    }
	  },

	  componentWillEnter: function componentWillEnter(done) {
	    if (this.props.enter) {
	      this.transition('enter', done);
	    } else {
	      done();
	    }
	  },

	  componentWillLeave: function componentWillLeave(done) {
	    if (this.props.leave) {
	      this.transition('leave', done);
	    } else {
	      done();
	    }
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	module.exports = ReactCSSTransitionGroupChild;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SPACE = ' ';
	var RE_CLASS = /[\n\t\r]/g;

	var norm = function norm(elemClass) {
	  return (SPACE + elemClass + SPACE).replace(RE_CLASS, SPACE);
	};

	module.exports = {
	  addClass: function addClass(elem, className) {
	    elem.className += ' ' + className;
	  },

	  removeClass: function removeClass(elem, needle) {
	    var elemClass = elem.className.trim();
	    var className = norm(elemClass);
	    needle = needle.trim();
	    needle = SPACE + needle + SPACE;
	    // 一个 cls 有可能多次出现：'link link2 link link3 link'
	    while (className.indexOf(needle) >= 0) {
	      className = className.replace(needle, SPACE);
	    }
	    elem.className = className.trim();
	  }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactTransitionEvents
	 */

	'use strict';
	/**
	 * EVENT_NAME_MAP is used to determine which event fired when a
	 * transition/animation ends, based on the style property used to
	 * define that event.
	 */
	var EVENT_NAME_MAP = {
	  transitionend: {
	    transition: 'transitionend',
	    WebkitTransition: 'webkitTransitionEnd',
	    MozTransition: 'mozTransitionEnd',
	    OTransition: 'oTransitionEnd',
	    msTransition: 'MSTransitionEnd'
	  },

	  animationend: {
	    animation: 'animationend',
	    WebkitAnimation: 'webkitAnimationEnd',
	    MozAnimation: 'mozAnimationEnd',
	    OAnimation: 'oAnimationEnd',
	    msAnimation: 'MSAnimationEnd'
	  }
	};

	var endEvents = [];

	function detectEvents() {
	  var testEl = document.createElement('div');
	  var style = testEl.style;

	  // On some platforms, in particular some releases of Android 4.x,
	  // the un-prefixed "animation" and "transition" properties are defined on the
	  // style object but the events that fire will still be prefixed, so we need
	  // to check if the un-prefixed events are useable, and if not remove them
	  // from the map
	  if (!('AnimationEvent' in window)) {
	    delete EVENT_NAME_MAP.animationend.animation;
	  }

	  if (!('TransitionEvent' in window)) {
	    delete EVENT_NAME_MAP.transitionend.transition;
	  }

	  for (var baseEventName in EVENT_NAME_MAP) {
	    var baseEvents = EVENT_NAME_MAP[baseEventName];
	    for (var styleName in baseEvents) {
	      if (styleName in style) {
	        endEvents.push(baseEvents[styleName]);
	        break;
	      }
	    }
	  }
	}

	if (typeof window !== 'undefined') {
	  detectEvents();
	}

	// We use the raw {add|remove}EventListener() call because EventListener
	// does not know how to remove event listeners and we really should
	// clean up. Also, these events are not triggered in older browsers
	// so we should be A-OK here.

	function addEventListener(node, eventName, eventListener) {
	  node.addEventListener(eventName, eventListener, false);
	}

	function removeEventListener(node, eventName, eventListener) {
	  node.removeEventListener(eventName, eventListener, false);
	}

	var ReactTransitionEvents = {
	  addEndEventListener: function addEndEventListener(node, eventListener) {
	    if (endEvents.length === 0) {
	      // If CSS transitions are not supported, trigger an "end animation"
	      // event immediately.
	      window.setTimeout(eventListener, 0);
	      return;
	    }
	    endEvents.forEach(function (endEvent) {
	      addEventListener(node, endEvent, eventListener);
	    });
	  },

	  endEvents: endEvents,

	  removeEndEventListener: function removeEndEventListener(node, eventListener) {
	    if (endEvents.length === 0) {
	      return;
	    }
	    endEvents.forEach(function (endEvent) {
	      removeEventListener(node, endEvent, eventListener);
	    });
	  }
	};

	module.exports = ReactTransitionEvents;

/***/ }
/******/ ])
});
