(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "_"], factory);
	else if(typeof exports === 'object')
		exports["GriddleWithCallback"] = factory(require("React"), require("_"));
	else
		root["GriddleWithCallback"] = factory(root["React"], root["_"]);
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

	var React = __webpack_require__(2);
	var Griddle = __webpack_require__(1);
	var _ = __webpack_require__(3);

	var GriddleWithCallback = React.createClass({displayName: 'GriddleWithCallback',
		getDefaultProps: function(){
			return {
				getExternalResults: null,
				resultsPerPage: 5, 
				loadingComponent: null
			}
		},
	    getInitialState: function(){
	      var initial = { "results": [],
	          "page": 0,
	          "maxPage": 0,
	          "sortColumn":null,
	          "sortAscending":true
	      };

		  // If we need to get external results, grab the results.
		  initial.isLoading = true; // Initialize to 'loading'

	      return initial;
	    },
	    componentDidMount: function(){
				var state = this.state;
				state.pageSize = this.props.resultsPerPage; 

				var that = this;

				if (!this.hasExternalResults()) {
					console.error("When using GriddleWithCallback, a getExternalResults callback must be supplied.");
					return; 
				}

				// Update the state with external results when mounting
				state = this.updateStateWithExternalResults(state, function(updatedState) {
					that.setState(updatedState);
				});
	    },
		componentWillReceiveProps: function(nextProps) {
			var state = this.state,
			that = this;

			// Update the state with external results.
			state = this.updateStateWithExternalResults(state, function(updatedState) {
				that.setState(updatedState);
			});
		},
	    setPage: function(index, pageSize){
	        //This should interact with the data source to get the page at the given index
			var that = this;
			var state = {
				page: index,
				pageSize: setDefault(pageSize, this.state.pageSize)
			};

			this.updateStateWithExternalResults(state, function(updatedState) {
				that.setState(updatedState);
			});
	    },
		getExternalResults: function(state, callback) {
			var filter,
			sortColumn,
			sortAscending,
			page,
			pageSize; 

			// Fill the search properties.
			if (state !== undefined && state.filter !== undefined) {
				filter = state.filter;
			} else {
				filter = this.state.filter;
			}

			if (state !== undefined && state.sortColumn !== undefined) {
				sortColumn = state.sortColumn;
			} else {
				sortColumn = this.state.sortColumn;
			}

			sortColumn = _.isEmpty(sortColumn) ? this.props.initialSort : sortColumn;

			if (state !== undefined && state.sortAscending !== undefined) {
				sortAscending = state.sortAscending;
			} else {
				sortAscending = this.state.sortAscending;
			}

			if (state !== undefined && state.page !== undefined) {
				page = state.page;
			} else {
				page = this.state.page;
			}

			if (state !== undefined && state.pageSize !== undefined) {
				pageSize = state.pageSize;
			} else {
				pageSize = this.state.pageSize;
			}

			// Obtain the results
			this.props.getExternalResults(filter, sortColumn, sortAscending, page, pageSize, callback);
		},
		updateStateWithExternalResults: function(state, callback) {
			var that = this;

			// Update the table to indicate that it's loading.
			this.setState({ isLoading: true });
			// Grab the results.
			this.getExternalResults(state, function(externalResults) {
				// Fill the state result properties
				state.results = externalResults.results;
				state.totalResults = externalResults.totalResults;
				state.maxPage = that.getMaxPage(externalResults.pageSize, externalResults.totalResults);
				state.isLoading = false;

				// If the current page is larger than the max page, reset the page.
				if (state.page >= state.maxPage) {
					state.page = state.maxPage - 1;
				}

				callback(state);
			});
		},
		getMaxPage: function(pageSize, totalResults){
				if (!totalResults) {
					totalResults = this.state.totalResults;
				}

				var maxPage = Math.ceil(totalResults / pageSize);
				return maxPage;
		},
		hasExternalResults: function() {
			return typeof(this.props.getExternalResults) === 'function';
		},
	    changeSort: function(sort, sortAscending){
	    	var that = this;
	      //this should change the sort for the given column
			var state = {
				page:0,
				sortColumn: sort,
				sortAscending: sortAscending
			};

			this.updateStateWithExternalResults(state, function(updatedState) {
				that.setState(updatedState);
			});
	    },
	    setFilter: function(filter){
	        /*
	          like everything else -- this is pretend code used to simulate something that we would do on the
	          server-side (aka we would generally post the filter as well as other information used to populate
	          the grid) and send back to the view (which would handle passing the data back to Griddle)
	        */
			var that = this;

			var state = {
				page: 0,
				filter: filter
			}

			this.updateStateWithExternalResults(state, function(updatedState) {
				//if filter is null or undefined reset the filter.
				if (_.isUndefined(filter) || _.isNull(filter) || _.isEmpty(filter)){
					updatedState.filter = filter;
					updatedState.filteredResults = null;
				}

				// Set the state.
				that.setState(updatedState);
			});
	    },
	    setPageSize: function(size){
				this.setPage(0, size);
	    },
	    render: function(){
			if(this.state.isLoading){
				return React.createElement(Griddle, {useExternal: true, externalSetPage: this.setPage, 
			        externalChangeSort: this.changeSort, externalSetFilter: this.setFilter, 
			        externalSetPageSize: this.setPageSize, externalMaxPage: this.state.maxPage, 
			        externalCurrentPage: this.state.page, results: [{"fake":"forLoading"}], tableClassName: "table", resultsPerPage: this.state.pageSize, 
			        externalSortColumn: this.state.sortColumn, externalSortAscending: this.state.sortAscending, showFilter: true, showSettings: true, 
					useCustomFormat: "true", customFormat: this.props.loadingComponent})
			}

			return React.createElement(Griddle, {useExternal: true, externalSetPage: this.setPage, 
				externalChangeSort: this.changeSort, externalSetFilter: this.setFilter, 
				externalSetPageSize: this.setPageSize, externalMaxPage: this.state.maxPage, 
				externalCurrentPage: this.state.page, results: this.state.results, tableClassName: "table", resultsPerPage: this.state.pageSize, 
				externalSortColumn: this.state.sortColumn, externalSortAscending: this.state.sortAscending, showFilter: true, showSettings: true})
	    }
	});

	module.exports = GriddleWithCallback;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var GridTable = __webpack_require__(4);
	var GridFilter = __webpack_require__(5);
	var GridPagination = __webpack_require__(6);
	var GridSettings = __webpack_require__(7);
	var GridTitle = __webpack_require__(8);
	var GridNoData = __webpack_require__(9);
	var CustomRowFormatContainer = __webpack_require__(10);
	var CustomPaginationContainer = __webpack_require__(11);
	var _ = __webpack_require__(3);

	var Griddle = React.createClass({displayName: 'Griddle',
	    getDefaultProps: function() {
	        return{
	            "columns": [],
	            "columnMetadata": [],
	            "resultsPerPage":5,
	            "results": [], // Used if all results are already loaded.
	            "initialSort": "",
	            "initialSortAscending": true,
	            "gridClassName":"",
	            "tableClassName":"",
	            "customRowFormatClassName":"",
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
	            "useCustomRowFormat": false,
	            "useCustomGridFormat": false,
	            "useCustomPager": false,
	            "customRowFormat": null,
	            "customGridFormat": null,
	            "customPager": {},
	            "allowToggleCustom":false,
	            "noDataMessage":"There is no data to display.",
	            "customNoData": null,
	            "showTableHeading":true,
	            "showPager":true,
	            "useExternal": false,
	            "externalSetPage": null,
	            "externalChangeSort": null,
	            "externalSetFilter": null,
	            "externalSetPageSize":null,
	            "externalMaxPage":null,
	            "externalCurrentPage": null,
	            "externalSortColumn": null,
	            "externalSortAscending": true,
	            "externalResults": [],
	            "infiniteScroll": null,
	            "bodyHeight": null,
	            "infiniteScrollSpacerHeight": 50
	        };
	    },
	    /* if we have a filter display the max page and results accordingly */
	    setFilter: function(filter) {
	        if(this.props.useExternal) {
	            this.props.externalSetFilter(filter);
	            return;
	        }

	        var that = this,
	        updatedState = {
	            page: 0,
	            filter: filter
	        };

	        // Obtain the state results.
	       updatedState.filteredResults = _.filter(this.props.results,
	       function(item) {
	            var arr = _.values(item);
	            for(var i = 0; i < arr.length; i++){
	               if ((arr[i]||"").toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0){
	                return true;
	               }
	            }

	            return false;
	        });

	        // Update the max page.
	        updatedState.maxPage = that.getMaxPage(updatedState.filteredResults);

	        //if filter is null or undefined reset the filter.
	        if (_.isUndefined(filter) || _.isNull(filter) || _.isEmpty(filter)){
	            updatedState.filter = filter;
	            updatedState.filteredResults = null;
	        }

	        // Set the state.
	        that.setState(updatedState);
	    },
	    setPageSize: function(size){
	        if(this.props.useExternal) {
	            this.props.externalSetPageSize(size);
	            return;
	        }

	        //make this better.
	        this.props.resultsPerPage = size;
	        this.setMaxPage();
	    },
	    toggleColumnChooser: function(){
	        this.setState({
	            showColumnChooser: !this.state.showColumnChooser
	        });
	    },
	    toggleCustomFormat: function(){
	        if(this.state.customFormatType === "grid"){
	            this.setProps({
	                useCustomGridFormat: !this.props.useCustomGridFormat
	            });
	        } else if(this.state.customFormatType === "row"){
	            this.setProps({
	                useCustomRowFormat: !this.props.useCustomRowFormat
	            });
	        }
	    },
	    getMaxPage: function(results, totalResults){
	        if(this.props.useExternal){
	          return this.props.externalMaxPage;
	        }

	        if (!totalResults) {
	          totalResults = (results||this.getCurrentResults()).length;
	        }
	        var maxPage = Math.ceil(totalResults / this.props.resultsPerPage);
	        return maxPage;
	    },
	    setMaxPage: function(results){
	        var maxPage = this.getMaxPage(results);
	        //re-render if we have new max page value
	        if (this.state.maxPage !== maxPage){
	          this.setState({ maxPage: maxPage, filteredColumns: this.props.columns });
	        }
	    },
	    setPage: function(number) {
	        if(this.props.useExternal) {
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
	    },
	    getColumns: function(){
	        var that = this;

	        var results = this.getCurrentResults();

	        //if we don't have any data don't mess with this
	        if (results === undefined || results.length === 0){ return [];}

	        var result = this.state.filteredColumns;

	        //if we didn't set default or filter
	        if (this.state.filteredColumns.length === 0){

	            var meta = [].concat(this.props.metadataColumns);

	            if(meta.indexOf(this.props.childrenColumnName) < 0){
	                meta.push(this.props.childrenColumnName);
	            }
	            result =  _.keys(_.omit(results[0], meta));
	        }


	        result = _.sortBy(result, function(item){
	            var metaItem = _.findWhere(that.props.columnMetadata, {columnName: item});

	            if (typeof metaItem === 'undefined' || metaItem === null || isNaN(metaItem.order)){
	                return 100;
	            }

	            return metaItem.order;
	        });

	        return result;
	    },
	    setColumns: function(columns){
	        columns = _.isArray(columns) ? columns : [columns];
	        this.setState({
	            filteredColumns: columns
	        });
	    },
	    nextPage: function() {
	        currentPage = this.getCurrentPage();
	        if (currentPage < this.getCurrentMaxPage() - 1) { this.setPage(currentPage + 1); }
	    },
	    previousPage: function() {
	      currentPage = this.getCurrentPage();
	        if (currentPage > 0) { this.setPage(currentPage - 1); }
	    },
	    changeSort: function(sort){
	        if(this.props.useExternal) {
	            this.props.externalChangeSort(sort, this.props.externalSortColumn === sort ? !this.props.externalSortAscending : true);

	            return;
	        }

	        var that = this,
	            state = {
	                page:0,
	                sortColumn: sort,
	                sortAscending: true
	            };

	        // If this is the same column, reverse the sort.
	        if(this.state.sortColumn == sort){
	            state.sortAscending = !this.state.sortAscending;
	        }

	        this.setState(state);
	    },
	    componentWillReceiveProps: function(nextProps) {
	        this.setMaxPage(nextProps.results);
	    },
	    getInitialState: function() {
	        var state =  {
	            maxPage: 0,
	            page: 0,
	            filteredResults: null,
	            filteredColumns: [],
	            filter: "",
	            sortColumn: this.props.initialSort,
	            sortAscending: this.props.initialSortAscending,
	            showColumnChooser: false,
	            isLoading: false
	        };

	        return state;
	    },
	    componentWillMount: function() {
	        this.verifyExternal();
	        this.verifyCustom();
	        this.setMaxPage();
	        //don't like the magic strings
	        if(this.props.useCustomGridFormat === true){
	            this.setState({
	                 customFormatType: "grid"
	            });
	        } else if(this.props.useCustomRowFormat === true){
	            this.setState({
	                customFormatType: "row"
	            });
	        }
	    },
	    //todo: clean these verify methods up
	    verifyExternal: function(){
	        if(this.props.useExternal === true){
	            //hooray for big ugly nested if
	            if(this.props.externalSetPage === null){
	                console.error("useExternal is set to true but there is no externalSetPage function specified.");
	            }

	            if(this.props.externalChangeSort === null){
	                console.error("useExternal is set to true but there is no externalChangeSort function specified.");
	            }

	            if(this.props.externalSetFilter === null){
	                console.error("useExternal is set to true but there is no externalSetFilter function specified.");
	            }

	            if(this.props.externalSetPageSize === null){
	                console.error("useExternal is set to true but there is no externalSetPageSize function specified.");
	            }

	            if(this.props.externalMaxPage === null){
	                console.error("useExternal is set to true but externalMaxPage is not set.");
	            }

	            if(this.props.externalCurrentPage === null){
	                console.error("useExternal is set to true but externalCurrentPage is not set. Griddle will not page correctly without that property when using external data.");
	            }
	        }
	    },
	    verifyCustom: function(){
	        if(this.props.useCustomGridFormat === true && this.props.customGridFormat === null){
	            console.error("useCustomGridFormat is set to true but no custom component was specified.")
	        }
	        if (this.props.useCustomRowFormat === true && this.props.customRowFormat === null){
	            console.error("useCustomRowFormat is set to true but no custom component was specified.")
	        }
	        if(this.props.useCustomGridFormat === true && this.props.useCustomRowFormat === true){
	            console.error("Cannot currently use both customGridFormat and customRowFormat.");
	        }
	    },
	    getDataForRender: function(data, cols, pageList){
	        var that = this;
	            //get the correct page size
	            if(this.state.sortColumn !== "" || this.props.initialSort !== ""){
	                data = _.sortBy(data, function(item){
	                    return item[that.state.sortColumn||that.props.initialSort];
	                });

	                if(this.state.sortAscending === false){
	                    data.reverse();
	                }
	            }

	            var currentPage = this.getCurrentPage();

	            if (!this.props.useExternal && pageList && (this.props.resultsPerPage * (currentPage+1) <= this.props.resultsPerPage * this.state.maxPage) && (currentPage >= 0)) {
	                if (this.isInfiniteScrollEnabled()) {
	                  // If we're doing infinite scroll, grab all results up to the current page.
	                  data = _.first(data, (currentPage + 1) * this.props.resultsPerPage);
	                } else {
	                  //the 'rest' is grabbing the whole array from index on and the 'initial' is getting the first n results
	                  var rest = _.rest(data, currentPage * this.props.resultsPerPage);
	                  data = _.initial(rest, rest.length-this.props.resultsPerPage);
	                }
	            }
	        var meta = [].concat(this.props.metadataColumns);
	        if (meta.indexOf(this.props.childrenColumnName) < 0){
	            meta.push(this.props.childrenColumnName);
	        }

	        var transformedData = [];

	        for(var i = 0; i<data.length; i++){
	            var mappedData = _.pick(data[i], cols.concat(meta));

	            if(typeof mappedData[that.props.childrenColumnName] !== "undefined" && mappedData[that.props.childrenColumnName].length > 0){
	                //internally we're going to use children instead of whatever it is so we don't have to pass the custom name around
	                mappedData["children"] = that.getDataForRender(mappedData[that.props.childrenColumnName], cols, false);

	                if(that.props.childrenColumnName !== "children") { delete mappedData[that.props.childrenColumnName]; }
	            }

	            transformedData.push(mappedData);
	        }

	        return transformedData;
	    },
	    //this is the current results
	    getCurrentResults: function(){
	      return this.state.filteredResults || this.props.results;
	    },
	    getCurrentPage: function(){
	      return this.props.externalCurrentPage||this.state.page;
	    },
	    getCurrentSort: function(){
	        return this.props.useExternal ? this.props.externalSortColumn : this.state.sortColumn;
	    },
	    getCurrentSortAscending: function(){
	        return this.props.useExternal ? this.props.externalSortAscending : this.state.sortAscending;
	    },
	    getCurrentMaxPage: function(){
	        return this.props.useExternal ? this.props.externalMaxPage : this.state.maxPage;
	    },
	    isInfiniteScrollEnabled: function(){
	      // If a custom format or pager is included, don't allow for infinite scrolling.
	      if (this.props.useCustomFormat || this.props.useCustomPager) {
	        return false;
	      }

	      // Otherwise, send back the property.
	      return this.props.infiniteScroll;
	    },
	    render: function() {
	        var that = this,
	            results = this.getCurrentResults();  // Attempt to assign to the filtered results, if we have any.

	        var headerTableClassName = this.props.tableClassName + " table-header";

	        //figure out if we want to show the filter section
	        var filter = (this.props.showFilter && this.props.useCustomGridFormat === false) ? React.createElement(GridFilter, {changeFilter: this.setFilter, placeholderText: this.props.filterPlaceholderText}) : "";
	        var settings = this.props.showSettings ? React.createElement("span", {className: "settings", onClick: this.toggleColumnChooser}, this.props.settingsText, " ", React.createElement("i", {className: "glyphicon glyphicon-cog"})) : "";

	        //if we have neither filter or settings don't need to render this stuff
	        var topSection = "";
	        if (this.props.showFilter || this.props.showSettings){
	           topSection = (
	            React.createElement("div", {className: "row top-section"}, 
	                React.createElement("div", {className: "col-xs-6"}, 
	                   filter
	                ), 
	                React.createElement("div", {className: "col-xs-6 right"}, 
	                    settings
	                )
	            ));
	        }

	        var resultContent = "";
	        var pagingContent = "";
	        var keys = [];
	        var cols = this.getColumns();

	        // If we're not loading results, fill the table with legitimate data.
	        if (!this.state.isLoading) {
	            //figure out which columns are displayed and show only those
	            var data = this.getDataForRender(results, cols, true);

	            //don't repeat this -- it's happening in getColumns and getDataForRender too...
	            var meta = this.props.metadataColumns;
	            if(meta.indexOf(this.props.childrenColumnName) < 0){
	                meta.push(this.props.childrenColumnName);
	            }

	            // Grab the column keys from the first results
	            keys = _.keys(_.omit(results[0], meta));

	            // Grab the current and max page values.
	            var currentPage = this.getCurrentPage();
	            var maxPage = this.getCurrentMaxPage();

	            // Determine if we need to enable infinite scrolling on the table.
	            var hasMorePages = (currentPage + 1) < maxPage;

	            //clean this stuff up so it's not if else all over the place. ugly if
	            if(this.props.useCustomGridFormat && this.props.customGridFormat !== null){
	                //this should send all the results it has
	                resultContent = React.createElement(this.props.customGridFormat, {data: this.props.results, className: this.props.customGridFormatClassName})
	            } else if(this.props.useCustomRowFormat){
	                resultContent = React.createElement(CustomRowFormatContainer, {data: data, columns: cols, metadataColumns: meta, className: this.props.customRowFormatClassName, customFormat: this.props.customRowFormat})
	            } else {
	                resultContent = React.createElement(GridTable, {columnMetadata: this.props.columnMetadata, data: data, columns: cols, metadataColumns: meta, className: this.props.tableClassName, infiniteScroll: this.isInfiniteScrollEnabled(), nextPage: this.nextPage, changeSort: this.changeSort, sortColumn: this.getCurrentSort(), sortAscending: this.getCurrentSortAscending(), showTableHeading: this.props.showTableHeading, bodyHeight: this.props.bodyHeight, infiniteScrollSpacerHeight: this.props.infiniteScrollSpacerHeight, hasMorePages: hasMorePages})
	            }

	            // Grab the paging content if it's to be displayed
	            if (this.props.showPager && !this.isInfiniteScrollEnabled()) {
	                pagingContent = (
	                  React.createElement("div", {className: "grid-footer clearfix"}, 
	                      this.props.useCustomPager ?
	                          React.createElement(CustomPaginationContainer, {next: this.nextPage, previous: this.previousPage, currentPage: currentPage, maxPage: maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText, customPager: this.props.customPager}) :
	                          React.createElement(GridPagination, {next: this.nextPage, previous: this.previousPage, currentPage: currentPage, maxPage: maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText})
	                      
	                  )
	              );
	            }
	        } else {
	            // Otherwise, display the loading content.
	            resultContent = (React.createElement("div", {className: "loading img-responsive center-block"}));
	        }

	        var columnSelector = this.state.showColumnChooser ? (
	            React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-md-12"}, 
	                    React.createElement(GridSettings, {columns: keys, selectedColumns: cols, setColumns: this.setColumns, settingsText: this.props.settingsText, maxRowsText: this.props.maxRowsText, setPageSize: this.setPageSize, showSetPageSize: !this.props.useCustomGridFormat, resultsPerPage: this.props.resultsPerPage, allowToggleCustom: this.props.allowToggleCustom, toggleCustomFormat: this.toggleCustomFormat, useCustomFormat: this.props.useCustomRowFormat || this.props.useCustomGridFormat, enableCustomFormatText: this.props.enableCustomFormatText, columnMetadata: this.props.columnMetadata})
	                )
	            )
	        ) : "";

	        var gridClassName = this.props.gridClassName.length > 0 ? "griddle " + this.props.gridClassName : "griddle";
	        //add custom to the class name so we can style it differently
	        gridClassName += this.props.useCustomRowFormat ? " griddle-custom" : "";


	        //todo: refactor this since it's basically the same now with a diff class
	        var gridTable = this.props.useCustomFormat ?
	            React.createElement("div", null, resultContent)
	            :       (React.createElement("div", {className: "grid-body"}, 
	                        resultContent
	                        ));

	        if (typeof results === 'undefined' || results.length === 0) {
	            var myReturn = null;
	            if (this.props.customNoData != null) {
	                myReturn = (React.createElement("div", {className: gridClassName}, React.createElement(this.props.customNoData, null)));

	                return myReturn
	            }

	            myReturn = (React.createElement("div", {className: gridClassName}, 
	                    topSection, 
	                    React.createElement(GridNoData, {noDataMessage: this.props.noDataMessage})
	                ));
	            return myReturn;

	        }

	        return (
	            React.createElement("div", {className: gridClassName}, 
	                topSection, 
	                columnSelector, 
	                React.createElement("div", {className: "grid-container panel"}, 
	                    gridTable, 
	                    pagingContent
	                )
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

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var GridTitle = __webpack_require__(8);
	var GridRowContainer = __webpack_require__(13);
	var _ = __webpack_require__(3);

	var GridTable = React.createClass({displayName: 'GridTable',
	  getDefaultProps: function(){
	    return{
	      "data": [],
	      "metadataColumns": [],
	      "className": "",
	      "infiniteScroll": false,
	      "nextPage": null,
	      "hasMorePages": false,
	      "infiniteScrollSpacerHeight": null,
	      "bodyHeight": null,
	      "tableHeading": ""
	    }
	  },
	  componentDidMount: function() {
	    // After the initial render, see if we need to load additional pages.
	    this.gridScroll();
	  },
	  componentDidUpdate: function(prevProps, prevState) {
	    // After the subsequent renders, see if we need to load additional pages.
	    this.gridScroll();
	  },
	  gridScroll: function(){
	    if (this.props.infiniteScroll) {
	      // If the scroll height is greater than the current amount of rows displayed, update the page.
	      var scrollable = this.refs.scrollable.getDOMNode();
	      var scrollTop = scrollable.scrollTop
	      var scrollHeight = scrollable.scrollHeight;
	      var clientHeight = scrollable.clientHeight;

	      // Determine the diff by subtracting the amount scrolled by the total height, taking into consideratoin
	      // the spacer's height.
	      var scrollHeightDiff = scrollHeight - (scrollTop + clientHeight) - this.props.infiniteScrollSpacerHeight;

	      // Make sure that we load results a little before reaching the bottom.
	      var compareHeight = scrollHeightDiff * 0.8;

	      if (compareHeight <= this.props.infiniteScrollSpacerHeight) {
	        this.props.nextPage();
	      }
	    }
	  },
	  render: function() {
	    var that = this;
	    //figure out if we need to wrap the group in one tbody or many
	    var anyHasChildren = false;

	    var nodes = this.props.data.map(function(row, index){
	        var hasChildren = (typeof row["children"] !== "undefined") && row["children"].length > 0;

	        //at least one item in the group has children.
	        if (hasChildren) { anyHasChildren = hasChildren; }

	        return React.createElement(GridRowContainer, {data: row, metadataColumns: that.props.metadataColumns, columnMetadata: that.props.columnMetadata, key: index, uniqueId: _.uniqueId("grid_row"), hasChildren: hasChildren, tableClassName: that.props.className})
	    });

	    var tableStyle = null;
	    var gridStyle = null;
	    var headerStyle = null;
	    var infiniteScrollSpacerRow = null;
	    if (this.props.infiniteScroll) {
	      // If we're enabling infinite scrolling, we'll want to include the max height of the grid body + allow scrolling.
	      gridStyle = {
	        "position": "relative",
	        "overflowY": "scroll",
	        "height": this.props.bodyHeight + "px"
	      };

	      // Only add the spacer row if the height is defined.
	      if (this.props.infiniteScrollSpacerHeight && this.props.hasMorePages) {
	        var spacerStyle = {
	          "height": this.props.infiniteScrollSpacerHeight + "px"
	        };

	        infiniteScrollSpacerRow = React.createElement("tr", {style: spacerStyle});
	      }
	    }

	    //construct the table heading component
	    var tableHeading = (this.props.showTableHeading ?
	        React.createElement(GridTitle, {columns: this.props.columns, changeSort: this.props.changeSort, sortColumn: this.props.sortColumn, sortAscending: this.props.sortAscending, columnMetadata: this.props.columnMetadata, headerStyle: headerStyle})
	        : "");

	    //check to see if any of the rows have children... if they don't wrap everything in a tbody so the browser doesn't auto do this
	    if (!anyHasChildren){
	      nodes = React.createElement("tbody", null, nodes, infiniteScrollSpacerRow)
	    }

	    return (
	            React.createElement("div", {ref: "scrollable", onScroll: this.gridScroll, style: gridStyle}, 
	              React.createElement("table", {className: this.props.className, style: tableStyle}, 
	                  tableHeading, 
	                  nodes
	              )
	            )
	        );
	    }
	});

	module.exports = GridTable;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);

	var GridFilter = React.createClass({displayName: 'GridFilter',
	    getDefaultProps: function(){
	      return {
	        "placeholderText": ""
	      }
	    },
	    handleChange: function(event){
	        this.props.changeFilter(event.target.value);
	    },
	    render: function(){
	        return React.createElement("div", {className: "row filter-container"}, React.createElement("div", {className: "col-md-6"}, React.createElement("input", {type: "text", name: "filter", placeholder: this.props.placeholderText, className: "form-control", onChange: this.handleChange})))
	    }
	});

	module.exports = GridFilter;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);

	//needs props maxPage, currentPage, nextFunction, prevFunction
	var GridPagination = React.createClass({displayName: 'GridPagination',
	    getDefaultProps: function(){
	        return{
	            "maxPage": 0,
	            "nextText": "",
	            "previousText": "",
	            "currentPage": 0
	        }
	    },
	    pageChange: function(event){
	        this.props.setPage(parseInt(event.target.value, 10)-1);
	    },
	    render: function(){
	        var previous = "";
	        var next = "";

	        if(this.props.currentPage > 0){
	            previous = React.createElement("span", {onClick: this.props.previous, className: "previous"}, React.createElement("i", {className: "glyphicon glyphicon-chevron-left"}), this.props.previousText)
	        }

	        if(this.props.currentPage !== (this.props.maxPage -1)){
	            next = React.createElement("span", {onClick: this.props.next, className: "next"}, this.props.nextText, React.createElement("i", {className: "glyphicon glyphicon-chevron-right"}))
	        }

	        var options = [];

	        for(var i = 1; i<= this.props.maxPage; i++){
	            options.push(React.createElement("option", {value: i, key: i}, i));
	        }

	        return (
	            React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-xs-4"}, previous), 
	                React.createElement("div", {className: "col-xs-4 center"}, 
	                    React.createElement("select", {value: this.props.currentPage+1, onChange: this.pageChange}, 
	                        options
	                    ), " / ", this.props.maxPage
	                ), 
	                React.createElement("div", {className: "col-xs-4 right"}, next)
	            )
	        )
	    }
	})

	module.exports = GridPagination;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);

	var GridSettings = React.createClass({displayName: 'GridSettings',
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
	                    return React.createElement("div", {className: "column checkbox"}, React.createElement("label", null, React.createElement("input", {type: "checkbox", disabled: true, name: "check", checked: checked, 'data-name': col}), col))
	                }
	                return React.createElement("div", {className: "column checkbox"}, React.createElement("label", null, React.createElement("input", {type: "checkbox", name: "check", onChange: that.handleChange, checked: checked, 'data-name': col}), col))
	            });
	        }

	        var toggleCustom = that.props.allowToggleCustom ?   
	                (React.createElement("div", {className: "form-group"}, 
	                    React.createElement("label", {htmlFor: "maxRows"}, this.props.enableCustomFormatText, ":"), 
	                    React.createElement("input", {type: "checkbox", checked: this.props.useCustomFormat, onChange: this.props.toggleCustomFormat})
	                ))
	                : "";

	        var setPageSize = this.props.showSetPageSize ? (React.createElement("div", null, 
	                    React.createElement("label", {htmlFor: "maxRows"}, this.props.maxRowsText, ":"), 
	                    React.createElement("select", {onChange: this.setPageSize, value: this.props.resultsPerPage}, 
	                        React.createElement("option", {value: "5"}, "5"), 
	                        React.createElement("option", {value: "10"}, "10"), 
	                        React.createElement("option", {value: "25"}, "25"), 
	                        React.createElement("option", {value: "50"}, "50"), 
	                        React.createElement("option", {value: "100"}, "100")
	                    )
	            )) : "";

	        return (React.createElement("div", {className: "griddle-settings panel"}, 
	                React.createElement("h5", null, this.props.settingsText), 
	                React.createElement("div", {className: "container-fluid griddle-columns"}, 
	                    React.createElement("div", {className: "row"}, nodes)
	                ), 
	                setPageSize, 
	                toggleCustom
	            ));
	    }
	});

	module.exports = GridSettings;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);

	var GridTitle = React.createClass({displayName: 'GridTitle',
	    getDefaultProps: function(){
	        return {
	           "columns":[],
	           "sortColumn": "",
	           "sortAscending": true,
	           "headerStyle": null
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

	            return (React.createElement("th", {onClick: that.sort, 'data-title': col, className: columnSort, key: displayName}, displayName));
	        });

	        return(
	            React.createElement("thead", {style: this.props.headerStyle}, 
	                React.createElement("tr", null, 
	                    nodes
	                )
	            )
	        );
	    }
	});

	module.exports = GridTitle;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);

	var GridNoData = React.createClass({displayName: 'GridNoData',
	    getDefaultProps: function(){
	        return {
	            "noDataMessage": "No Data"
	        }
	    },
	    render: function(){
	        var that = this;

	        return(
	            React.createElement("div", null, this.props.noDataMessage)
	        );
	    }
	});

	module.exports = GridNoData;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);

	var CustomRowFormatContainer = React.createClass({displayName: 'CustomRowFormatContainer',
	  getDefaultProps: function(){
	    return{
	      "data": [],
	      "metadataColumns": [],
	      "className": "",
	      "customFormat": {}
	    }
	  },
	  render: function() {
	    var that = this;

	    if (typeof that.props.customFormat !== 'function'){
	      console.log("Couldn't find valid template.");
	      return (React.createElement("div", {className: this.props.className}));
	    }

	    var nodes = this.props.data.map(function(row, index){
	        return React.createElement(that.props.customFormat, {data: row, metadataColumns: that.props.metadataColumns, key: index})
	    });

	    return (
	      React.createElement("div", {className: this.props.className}, 
	          nodes
	      )
	    );
	  }
	});

	module.exports = CustomRowFormatContainer;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);

	var CustomPaginationContainer = React.createClass({displayName: 'CustomPaginationContainer',
	  getDefaultProps: function(){
	    return{
	      "maxPage": 0,
	      "nextText": "",
	      "previousText": "",
	      "currentPage": 0,
	      "customPager": {}
	    }
	  },
	  render: function() {
	    var that = this;

	    if (typeof that.props.customPager !== 'function'){
	      console.log("Couldn't find valid template.");
	      return (React.createElement("div", null));
	    }

	    return (React.createElement(that.props.customPager, {maxPage: this.props.maxPage, nextText: this.props.nextText, previousText: this.props.previousText, currentPage: this.props.currentPage, setPage: this.props.setPage, previous: this.props.previous, next: this.props.next}));
	  }
	});

	module.exports = CustomPaginationContainer;


/***/ },
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var GridRow = __webpack_require__(14);

	var GridRowContainer = React.createClass({displayName: 'GridRowContainer',
	    getInitialState: function(){
	        return {
	           "data": {
	           },
	           "metadataColumns": [],
	           "showChildren":false
	        }
	    },
	    toggleChildren: function(){
	        this.setState({
	            showChildren: this.state.showChildren === false
	        });
	    },
	    render: function(){
	        var that = this;

	        if(typeof this.props.data === "undefined"){return (React.createElement("tbody", null));}
	        var arr = [];

	        arr.push(React.createElement(GridRow, {data: this.props.data, columnMetadata: this.props.columnMetadata, metadataColumns: that.props.metadataColumns, 
	          hasChildren: that.props.hasChildren, toggleChildren: that.toggleChildren, showChildren: that.state.showChildren, key: that.props.uniqueId}));
	          var children = null;
	        if(that.state.showChildren){
	            children =  that.props.hasChildren && this.props.data["children"].map(function(row, index){
	                if(typeof row["children"] !== "undefined"){
	                  return (React.createElement("tr", null, React.createElement("td", {colSpan: Object.keys(that.props.data).length - that.props.metadataColumns.length, className: "griddle-parent"}, 
	                      React.createElement(Griddle, {results: [row], tableClassName: that.props.tableClassName, showTableHeading: false, showPager: false, columnMetadata: that.props.columnMetadata})
	                    )));
	                }

	                return React.createElement(GridRow, {data: row, metadataColumns: that.props.metadataColumns, isChildRow: true, columnMetadata: that.props.columnMetadata, key: _.uniqueId("grid_row")})
	            });


	        }

	        return that.props.hasChildren === false ? arr[0] : React.createElement("tbody", null, that.state.showChildren ? arr.concat(children) : arr)
	    }
	});

	module.exports = GridRowContainer;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);

	var GridRow = React.createClass({displayName: 'GridRow',
	    getDefaultProps: function(){
	      return {
	        "isChildRow": false,
	        "showChildren": false,
	        "data": {},
	        "metadataColumns": [],
	        "hasChildren": false,
	        "columnMetadata": null
	      }
	    },
	    handleClick: function(){
	      this.props.toggleChildren();
	    },
	    render: function() {
	        var that = this;

	        var nodes = _.pairs(_.omit(this.props.data, this.props.metadataColumns)).map(function(col, index) {
	            var returnValue = null;
	            var meta = _.findWhere(that.props.columnMetadata, {columnName: col[0]});

	            if (that.props.columnMetadata !== null && that.props.columnMetadata.length > 0 && typeof meta !== "undefined"){
	              var colData = (typeof meta === 'undefined' || typeof meta.customComponent === 'undefined' || meta.customComponent === null) ? col[1] : React.createElement(meta.customComponent, {data: col[1], rowData: that.props.data});
	              returnValue = (meta == null ? returnValue : React.createElement("td", {onClick: that.handleClick, className: meta.cssClassName, key: index}, colData));
	            }

	            return returnValue || (React.createElement("td", {onClick: that.handleClick, key: index}, col[1]));
	        });

	        //this is kind of hokey - make it better
	        var className = "standard-row";

	        if(that.props.isChildRow){
	            className = "child-row";
	        } else if (that.props.hasChildren){
	            className = that.props.showChildren ? "parent-row expanded" : "parent-row";
	        }

	        return (React.createElement("tr", {className: className}, nodes));
	    }
	});

	module.exports = GridRow;


/***/ }
/******/ ])
});
