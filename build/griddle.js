var Griddle =
/******/ (function(modules) { // webpackBootstrap
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

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);
	var GridBody = __webpack_require__(3);
	var GridFilter = __webpack_require__(4);
	var GridPagination = __webpack_require__(5);
	var GridSettings = __webpack_require__(6);
	var GridTitle = __webpack_require__(7);
	var _ = __webpack_require__(2);

	var Griddle = React.createClass({displayName: 'Griddle',
	    getDefaultProps: function() {
	        return{
	            "columns": [],
	            "resultsPerPage":5,
	            "results": [], // Used if all results are already loaded.
	            "getExternalResults": null, // Used if obtaining results from an API, etc.
	            "initialSort": "",
	            "gridClassName":"",
	            "settingsText": "Settings",
	            "filterPlaceholderText": "Filter Results",
	            "nextText": "Next",
	            "previousText": "Previous",
	            "maxRowsText": "Rows per page",
	            //this column will determine which column holds subgrid data
	            //it will be passed through with the data object but will not be rendered
	            "childrenColumnName": "children",
	            //Any column in this list will be treated as metadata and will be passed through with the data but won't be rendered
	            "metadataColumns": [],
	            "showFilter": false,
	            "showSettings": false
	        };
	    },
	    /* if we have a filter display the max page and results accordingly */
	    setFilter: function(filter) {
	        if(filter){
	            var that = this,
	                state = {
	                    page: 0,
	                    filter: filter
	                },
	                updateAfterResultsObtained = function(updatedState) {
	                    // Update the max page.
	                    updatedState.maxPage = that.getMaxPage(updatedState.filteredResults);

	                    // Set the state.
	                    that.setState(updatedState);
	                };

	            // Obtain the state results.
	            if (this.hasExternalResults()) {
	                // Update the state with external results.
	                this.updateStateWithExternalResults(state, updateAfterResultsObtained);
	            } else {
	               state.filteredResults = _.filter(this.state.results,
	                function(item) {
	                    var arr = _.values(item);
	                    for(var i = 0; i < arr.length; i++){
	                       if ((arr[i]||"").toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0){
	                        return true;
	                       }
	                    }

	                    return false;
	                });

	                // Update the state after obtaining the results.
	                updateAfterResultsObtained(state);
	            }
	        } else {
	            this.setState({
	                filteredResults: null,
	                filter: filter,
	                maxPage: this.getMaxPage(null)
	            });
	        }
	    },
	    getExternalResults: function(state, callback) {
	        var filter,
	            sortColumn,
	            sortAscending,
	            page;

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

	        // Obtain the results
	        this.props.getExternalResults(filter, sortColumn, sortAscending, page, this.props.resultsPerPage, callback);
	    },
	    updateStateWithExternalResults: function(state, callback) {
	        // Update the table to indicate that it's loading.
	        this.setState({ isLoading: true });

	        // Grab the results.
	        this.getExternalResults(state, function(externalResults) {
	            // Fill the state result properties
	            state.results = externalResults.results;
	            state.totalResults = externalResults.totalResults;
	            state.isLoading = false;

	            callback(state);
	        });
	    },
	    hasExternalResults: function() {
	        return typeof(this.props.getExternalResults) === 'function';
	    },
	    setPageSize: function(size){
	        //make this better.
	        this.props.resultsPerPage = size;
	        this.setMaxPage();
	    },
	    toggleColumnChooser: function(){
	        this.setState({
	            showColumnChooser: this.state.showColumnChooser == false
	        });
	    },
	    getMaxPage: function(results){
	        var totalResults;
	        if (this.hasExternalResults()) {
	            totalResults = this.state.totalResults;
	        } else {
	            totalResults = (results||this.state.results).length;
	        }
	        var maxPage = Math.ceil(totalResults / this.props.resultsPerPage);
	        return maxPage;
	    },
	    setMaxPage: function(results){
	        var maxPage = this.getMaxPage();
	        //re-render if we have new max page value
	        if (this.state.maxPage != maxPage){
	            this.setState({ maxPage: maxPage, filteredColumns: this.props.columns });
	        }
	    },
	    setPage: function(number) {
	       //check page size and move the filteredResults to pageSize * pageNumber
	        if (number * this.props.resultsPerPage <= this.props.resultsPerPage * this.state.maxPage) {
	            var that = this,
	                state = {
	                    page: number
	                };

	            if (this.hasExternalResults()) {
	                this.updateStateWithExternalResults(state, function(updatedState) {
	                    that.setState(updatedState);
	                });
	            } else {
	                that.setState(state);
	            }
	        }
	    },
	    getColumns: function(){
	        //if we don't have any data don't mess with this
	        if (this.state.results === undefined || this.state.results.length == 0){ return [];}

	        //if we didn't set default or filter
	        if (this.state.filteredColumns.length == 0){
	            var meta = [].concat(this.props.metadataColumns);
	            meta.push(this.props.childrenColumnName);
	            return _.keys(_.omit(this.state.results[0], meta));
	        }
	        return this.state.filteredColumns;
	    },
	    setColumns: function(columns){
	        columns = _.isArray(columns) ? columns : [columns];
	        this.setState({
	            filteredColumns: columns
	        });
	    },
	    nextPage: function() {
	        if (this.state.page < this.state.maxPage - 1) { this.setPage(this.state.page + 1); }
	    },
	    previousPage: function() {
	        if (this.state.page > 0) { this.setPage(this.state.page - 1); }
	    },
	    changeSort: function(sort){
	        var that = this,
	            state = {
	                page:0,
	                sortColumn: sort,
	                sortAscending: true
	            };

	        // If this is the same column, reverse the sort.
	        if(this.state.sortColumn == sort){
	            state.sortAscending = this.state.sortAscending == false;
	        }

	        if (this.hasExternalResults()) {
	            this.updateStateWithExternalResults(state, function(updatedState) {
	                that.setState(updatedState);
	            });
	        } else {
	            this.setState(state);
	        }
	    },
	    componentWillReceiveProps: function(nextProps) {
	        if (this.hasExternalResults()) {
	            // TODO: Confirm
	            var state = this.state,
	                that = this;

	            // Update the state with external results.
	            state = this.updateStateWithExternalResults(state, function(updatedState) {
	                that.setState(updatedState);
	            });
	        } else {
	            this.setMaxPage(nextProps.results);
	        }
	    },
	    getInitialState: function() {
	        var state =  {
	            maxPage: 0,
	            page: 0,
	            filteredResults: null,
	            filteredColumns: [],
	            filter: "",
	            sortColumn: "",
	            sortAscending: true,
	            showColumnChooser: false,
	            isLoading: false
	        };

	        // If we need to get external results, grab the results.
	        if (!this.hasExternalResults()) {
	            state.results = this.props.results;
	        } else {
	            state.isLoading = true; // Initialize to 'loading'
	        }

	        return state;
	    },
	    componentWillMount: function() {
	        if (!this.hasExternalResults()) {
	            this.setMaxPage();
	        }
	    },
	    componentDidMount: function() {
	        var state = this.state;
	        var that = this;

	        if (this.hasExternalResults()) {
	            // Update the state with external results when mounting
	            state = this.updateStateWithExternalResults(state, function(updatedState) {
	                that.setState(updatedState);
	                that.setMaxPage();
	            });
	        }
	    },
	    grabPath: function(obj, path) {
	        var pathParts = path.split('.');
	        var partCount = pathParts.length;
	        for (var i = 0; i < partCount; i++) {
	            if(_.isUndefined(obj) || !_.isObject(obj)) return undefined;
	            obj = obj[pathParts[i]];
	        }
	        return obj;
	    },
	    getDataForRender: function(data, cols, pageList){
	        var that = this;

	        if (!this.hasExternalResults()) {
	            //get the correct page size
	            if(this.state.sortColumn != "" || this.props.initialSort != ""){
	                data = _.sortBy(data, function(item){
	                    return item[that.state.sortColumn||that.props.initialSort];
	                });

	                if(this.state.sortAscending == false){
	                    data.reverse();
	                }
	            }

	            if (pageList && (this.props.resultsPerPage * (this.state.page+1) <= this.props.resultsPerPage * this.state.maxPage) && (this.state.page >= 0)) {
	                //the 'rest' is grabbing the whole array from index on and the 'initial' is getting the first n results
	                var rest = _.rest(data, this.state.page * this.props.resultsPerPage);
	                data = _.initial(rest, rest.length-this.props.resultsPerPage);
	            }
	        } else {
	            // Don't sort or page data if loaded externally.
	        }

	        var meta = [].concat(this.props.metadataColumns);
	        meta.push(this.props.childrenColumnName);

	        var transformedData = [];

	        for(var i = 0; i<data.length; i++){
	            var mappedData = _.map(cols.concat(meta), function(colPath) {
	                return that.grabPath(data[i], colPath)
	            }).filter(function (val) { return !_.isUndefined(val)});

	            if(typeof mappedData[that.props.childrenColumnName] !== "undefined" && mappedData[that.props.childrenColumnName].length > 0){
	                //internally we're going to use children instead of whatever it is so we don't have to pass the custom name around
	                mappedData["children"] = that.getDataForRender(mappedData[that.props.childrenColumnName], cols, false);

	                if(that.props.childrenColumnName !== "children") { delete mappedData[that.props.childrenColumnName]; }
	            }

	            transformedData.push(mappedData);
	        }

	        return transformedData;
	    },
	    render: function() {
	        var that = this,
	            results = this.state.filteredResults || this.state.results; // Attempt to assign to the filtered results, if we have any.

	        var headerTableClassName = this.props.gridClassName + " table-header";

	        //figure out if we want to show the filter section
	        var filter = this.props.showFilter ? GridFilter({changeFilter: this.setFilter, placeholderText: this.props.filterPlaceholderText}) : "";
	        var settings = this.props.showSettings ? React.DOM.span({className: "settings", onClick: this.toggleColumnChooser}, this.props.settingsText, " ", React.DOM.i({className: "glyphicon glyphicon-cog"})) : "";

	        //if we have neither filter or settings don't need to render this stuff
	        var topSection = "";
	        if (this.props.showFilter || this.props.showSettings){
	           topSection = (
	            React.DOM.div({className: "row top-section"}, 
	                React.DOM.div({className: "col-xs-6"}, 
	                   filter
	                ), 
	                React.DOM.div({className: "col-xs-6 right"}, 
	                    settings
	                )
	            ));
	        }

	        var resultContent = "";
	        var pagingContent = "";
	        var keys = [];

	        // If we're not loading results, fill the table with legitimate data.
	        if (!this.state.isLoading) {
	            //figure out which columns are displayed and show only those
	            var cols = this.getColumns();

	            var data = this.getDataForRender(results, cols, true);

	            var meta = this.props.metadataColumns;
	            meta.push(this.props.childrenColumnName);

	            // Grab the column keys from the first results
	            keys = _.keys(_.omit(results[0], meta));

	            resultContent = (GridBody({data: data, columns: cols, metadataColumns: meta, className: this.props.gridClassName}));
	            pagingContent = (GridPagination({next: this.nextPage, previous: this.previousPage, currentPage: this.state.page, maxPage: this.state.maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText}));
	        } else {
	            // Otherwise, display the loading content.
	            resultContent = (React.DOM.div({className: "loading img-responsive center-block"}));
	        }

	        var columnSelector = this.state.showColumnChooser ? (
	            React.DOM.div({className: "row"}, 
	                React.DOM.div({className: "col-md-12"}, 
	                    GridSettings({columns: keys, selectedColumns: this.getColumns(), setColumns: this.setColumns, settingsText: this.props.settingsText, maxRowsText: this.props.maxRowsText, setPageSize: this.setPageSize, resultsPerPage: this.props.resultsPerPage})
	                )
	            )
	        ) : "";

	        return (
	            React.DOM.div({className: "griddle"}, 
	                topSection, 
	                columnSelector, 
	                React.DOM.div({className: "grid-container panel"}, 
	                    React.DOM.div({className: "grid-body"}, 
	                        React.DOM.table({className: headerTableClassName}, 
	                            GridTitle({columns: this.getColumns(), changeSort: this.changeSort, sortColumn: this.state.sortColumn, sortAscending: this.state.sortAscending})
	                        ), 
	                        resultContent
	                    ), 
	                    React.DOM.div({className: "grid-footer"}, 
	                        pagingContent
	                    )
	                )
	            )
	        );

	    }
	});

	module.exports = Griddle;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = _;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	var React = __webpack_require__(1);
	var GridRowContainer = __webpack_require__(8);

	var GridBody = React.createClass({displayName: 'GridBody',
	  getDefaultProps: function(){
	    return{
	      "data": [],
	      "metadataColumns": [],
	      "className": ""
	    }
	  },
	  render: function() {
	    var that = this;

	    var nodes = this.props.data.map(function(row, index){
	        return GridRowContainer({data: row, metadataColumns: that.props.metadataColumns})
	    });

	    return (

	            React.DOM.table({className: this.props.className}, 
	                nodes
	            )
	        );
	    }
	});

	module.exports = GridBody;


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
	var React = __webpack_require__(1);

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
	        return React.DOM.div({className: "row filter-container"}, React.DOM.div({className: "col-md-6"}, React.DOM.input({type: "text", name: "filter", placeholder: this.props.placeholderText, className: "form-control", onChange: this.handleChange})))
	    }
	});

	module.exports = GridFilter;


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
	var React = __webpack_require__(1);

	//needs props maxPage, currentPage, nextFunction, prevFunction
	var GridPagination = React.createClass({displayName: 'GridPagination',
	    getDefaultProps: function(){
	        return{
	            "maxPage": 0,
	            "nextText": "",
	            "previousText": "",
	            "currentPage": 0,
	        }
	    },
	    pageChange: function(event){
	        this.props.setPage(parseInt(event.target.value)-1);
	    },
	    render: function(){
	        var previous = "";
	        var next = "";

	        if(this.props.currentPage > 0){
	            previous = React.DOM.span({onClick: this.props.previous, className: "previous"}, React.DOM.i({className: "glyphicon glyphicon-chevron-left"}), this.props.previousText)
	        }

	        if(this.props.currentPage != (this.props.maxPage -1)){
	            next = React.DOM.span({onClick: this.props.next, className: "next"}, this.props.nextText, React.DOM.i({className: "glyphicon glyphicon-chevron-right"}))
	        }

	        var options = [];

	        for(var i = 1; i<= this.props.maxPage; i++){
	            options.push(React.DOM.option({value: i}, i));
	        }

	        return (
	            React.DOM.div({className: "row"}, 
	                React.DOM.div({className: "col-xs-4"}, previous), 
	                React.DOM.div({className: "col-xs-4 center"}, 
	                    React.DOM.select({value: this.props.currentPage+1, onChange: this.pageChange}, 
	                        options
	                    ), " / ", this.props.maxPage
	                ), 
	                React.DOM.div({className: "col-xs-4 right"}, next)
	            )
	        )
	    }
	})

	module.exports = GridPagination;


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
	var React = __webpack_require__(1);
	var _ = __webpack_require__(2);

	var GridSettings = React.createClass({displayName: 'GridSettings',
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
	            return React.DOM.div({className: "column checkbox"}, React.DOM.label(null, React.DOM.input({type: "checkbox", name: "check", onChange: that.handleChange, checked: checked, 'data-name': col}), col))
	        });
	        return (React.DOM.div({className: "columnSelector panel"}, React.DOM.h5(null, this.props.settingsText), React.DOM.div({className: "container-fluid"}, React.DOM.div({className: "row"}, nodes)), React.DOM.hr(null), 
	            React.DOM.label({for: "maxRows"}, this.props.maxRowsText, ":"), 
	            React.DOM.select({class: "form-control", onChange: this.setPageSize, value: this.props.resultsPerPage}, 
	                React.DOM.option({value: "5"}, "5"), 
	                React.DOM.option({value: "10"}, "10"), 
	                React.DOM.option({value: "25"}, "25"), 
	                React.DOM.option({value: "50"}, "50"), 
	                React.DOM.option({value: "100"}, "100")
	            )
	            ));
	    }
	});

	module.exports = GridSettings;


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
	var React = __webpack_require__(1);

	var GridTitle = React.createClass({displayName: 'GridTitle',
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
	            }  else if (that.props.sortColumn == col && that.props.sortAscending == false){
	                columnSort += "sort-descending"
	            }
	            return React.DOM.th({onClick: that.sort, 'data-title': col, className: columnSort}, col)
	        });

	        return(
	            React.DOM.thead(null, 
	                React.DOM.tr(null, 
	                    nodes
	                )
	            )
	        );
	    }
	});

	module.exports = GridTitle;


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
	var React = __webpack_require__(1);
	var GridRow = __webpack_require__(9);

	var GridRowContainer = React.createClass({displayName: 'GridRowContainer',
	    getInitialState: function(){
	        return {
	           "data": {
	           },
	           "metadataColumns": []
	        }
	    },
	    toggleChildren: function(){
	        this.setState({
	            showChildren: this.state.showChildren == false
	        });
	    },
	    getInitialState: function(){
	        return { showChildren: false };
	    },
	    render: function(){
	        var that = this;

	        if(typeof this.props.data === "undefined"){return (React.DOM.tbody(null));}
	        var arr = [];
	        var hasChildren = (typeof this.props.data["children"] !== "undefined") && this.props.data["children"].length > 0;

	        arr.push(GridRow({data: this.props.data, metadataColumns: that.props.metadataColumns, hasChildren: hasChildren, toggleChildren: that.toggleChildren, showChildren: that.state.showChildren}));

	        if(that.state.showChildren){
	            var children =  hasChildren && this.props.data["children"].map(function(row, index){
	                return GridRow({data: row, metadataColumns: that.props.metadataColumns, isChildRow: true})
	            });
	        }

	        return React.DOM.tbody(null, that.state.showChildren ? arr.concat(children) : arr)
	    }
	});

	module.exports = GridRowContainer;


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
	var React = __webpack_require__(1);
	var _ = __webpack_require__(2);

	var GridRow = React.createClass({displayName: 'GridRow',
	    getDefaultProps: function(){
	      return {
	        "isChildRow": false,
	        "showChildren": false,
	        "data": {},
	        "metadataColumns": [],
	        "hasChildren": false
	      }
	    },
	    handleClick: function(){
	      this.props.toggleChildren(); 
	    },
	    render: function() {
	        var that = this;

	        var nodes = _.toArray(_.omit(this.props.data, this.props.metadataColumns)).map(function(col, index) {
	            return React.DOM.td({onClick: that.handleClick}, col)
	        });

	        //this is kind of hokey - make it better
	        var className = "standard-row";

	        if(that.props.isChildRow){
	            className = "child-row";
	        } else if (that.props.hasChildren){
	            className = that.props.showChildren ? "parent-row expanded" : "parent-row";
	        }

	        return (React.DOM.tr({className: className}, nodes));
	    }
	});

	module.exports = GridRow;


/***/ }
/******/ ])