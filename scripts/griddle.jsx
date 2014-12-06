/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var GridBody = require('./gridBody.jsx');
var GridFilter = require('./gridFilter.jsx');
var GridPagination = require('./gridPagination.jsx');
var GridSettings = require('./gridSettings.jsx');
var GridTitle = require('./gridTitle.jsx');
var GridNoData = require('./gridNoData.jsx');
var CustomFormatContainer = require('./customFormatContainer.jsx');
var CustomPaginationContainer = require('./customPaginationContainer.jsx');
var _ = require('underscore');

var Griddle = React.createClass({
    getDefaultProps: function() {
        return{
            "columns": [],
            "columnMetadata": [],
            "resultsPerPage":5,
            "results": [], // Used if all results are already loaded.
            "getExternalResults": null, // Used if obtaining results from an API, etc.
            "initialSort": "",
            "initialSortAscending": true,
            "gridClassName":"",
            "tableClassName":"",
            "customFormatClassName":"",
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
            "useCustomFormat": false,
            "useCustomPager": false,
            "customFormat": {},
            "customPager": {},
            "allowToggleCustom":false,
            "noDataMessage":"There is no data to display.",
            "customNoData": null,
            "showTableHeading":true,
            "showPager":true
        };
    },
    /* if we have a filter display the max page and results accordingly */
    setFilter: function(filter) {
        var that = this,
        state = {
            page: 0,
            filter: filter
        },
        updateAfterResultsObtained = function(updatedState) {
            //if filter is null or undefined reset the filter.
            if (_.isUndefined(filter) || _.isNull(filter) || _.isEmpty(filter)){
                updatedState.filter = filter;
                updatedState.filteredResults = null;
            }

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

            // Update the max page.
            state.maxPage = that.getMaxPage(state.filteredResults);

            // Update the state after obtaining the results.
            updateAfterResultsObtained(state);
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

        // Obtain the results
        this.props.getExternalResults(filter, sortColumn, sortAscending, page, this.props.resultsPerPage, callback);
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
            state.maxPage = that.getMaxPage(externalResults.results, state.totalResults);
            state.isLoading = false;

            // If the current page is larger than the max page, reset the page.
            if (state.page >= state.maxPage) {
                state.page = state.maxPage - 1;
            }

            callback(state);
        });
    },
    hasExternalResults: function() {
        return typeof(this.props.getExternalResults) === 'function';
    },
    setPageSize: function(size){
        //make this better.
        this.props.resultsPerPage = size;

        if (this.hasExternalResults()) {
            // Reload the results by setting the page.
            this.setPage(0);
        } else {
            this.setMaxPage();
        }
    },
    toggleColumnChooser: function(){
        this.setState({
            showColumnChooser: this.state.showColumnChooser === false
        });
    },
    toggleCustomFormat: function(){
        this.setProps({
            useCustomFormat: this.props.useCustomFormat === false
        });
    },
    getMaxPage: function(results, totalResults){
        if (!totalResults) {
            if (this.hasExternalResults()) {
                totalResults = this.state.totalResults;
            } else {
                totalResults = (results||this.state.filteredResults||this.state.results).length;
            }
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
        var that = this;

        //if we don't have any data don't mess with this
        if (this.state.results === undefined || this.state.results.length === 0){ return [];}

        var result = this.state.filteredColumns;

        //if we didn't set default or filter
        if (this.state.filteredColumns.length === 0){

            var meta = [].concat(this.props.metadataColumns);

            if(meta.indexOf(this.props.childrenColumnName) < 0){
                meta.push(this.props.childrenColumnName);
            }
            result =  _.keys(_.omit(this.state.results[0], meta));
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
            state.sortAscending = !this.state.sortAscending;
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
            sortColumn: this.props.initialSort,
            sortAscending: this.props.initialSortAscending,
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

    getDataForRender: function(data, cols, pageList){
        var that = this;
        if (!this.hasExternalResults()) {
            //get the correct page size
            if(this.state.sortColumn !== "" || this.props.initialSort !== ""){
                data = _.sortBy(data, function(item){
                    return item[that.state.sortColumn||that.props.initialSort];
                });

                if(this.state.sortAscending === false){
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
    render: function() {
        var that = this,
            results = this.state.filteredResults || this.state.results; // Attempt to assign to the filtered results, if we have any.

        var headerTableClassName = this.props.tableClassName + " table-header";

        //figure out if we want to show the filter section
        var filter = this.props.showFilter ? <GridFilter changeFilter={this.setFilter} placeholderText={this.props.filterPlaceholderText} /> : "";
        var settings = this.props.showSettings ? <span className="settings" onClick={this.toggleColumnChooser}>{this.props.settingsText} <i className="glyphicon glyphicon-cog"></i></span> : "";

        //if we have neither filter or settings don't need to render this stuff
        var topSection = "";
        if (this.props.showFilter || this.props.showSettings){
           topSection = (
            <div className="row top-section">
                <div className="col-xs-6">
                   {filter}
                </div>
                <div className="col-xs-6 right">
                    {settings}
                </div>
            </div>);
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

            //clean this stuff up so it's not if else all over the place.
            resultContent = this.props.useCustomFormat ? 
                (<CustomFormatContainer data= {data} columns={cols} metadataColumns={meta} className={this.props.customFormatClassName} customFormat={this.props.customFormat}/>)
                : (<GridBody columnMetadata={this.props.columnMetadata} data={data} columns={cols} metadataColumns={meta} className={this.props.tableClassName}/>);

            pagingContent = this.props.useCustomPager ? 
                (<CustomPaginationContainer next={this.nextPage} previous={this.previousPage} currentPage={this.state.page} maxPage={this.state.maxPage} setPage={this.setPage} nextText={this.props.nextText} previousText={this.props.previousText} customPager={this.props.customPager}/>)
                : (<GridPagination next={this.nextPage} previous={this.previousPage} currentPage={this.state.page} maxPage={this.state.maxPage} setPage={this.setPage} nextText={this.props.nextText} previousText={this.props.previousText}/>);
        } else {
            // Otherwise, display the loading content.
            resultContent = (<div className="loading img-responsive center-block"></div>);
        }

        var columnSelector = this.state.showColumnChooser ? (
            <div className="row">
                <div className="col-md-12">
                    <GridSettings columns={keys} selectedColumns={cols} setColumns={this.setColumns} settingsText={this.props.settingsText} maxRowsText={this.props.maxRowsText}  setPageSize={this.setPageSize} resultsPerPage={this.props.resultsPerPage} allowToggleCustom={this.props.allowToggleCustom} toggleCustomFormat={this.toggleCustomFormat} useCustomFormat={this.props.useCustomFormat} enableCustomFormatText={this.props.enableCustomFormatText} columnMetadata={this.props.columnMetadata} />
                </div>
            </div>
        ) : "";

        var gridClassName = this.props.gridClassName.length > 0 ? "griddle " + this.props.gridClassName : "griddle";
        //add custom to the class name so we can style it differently
        gridClassName += this.props.useCustomFormat ? " griddle-custom" : "";


        var gridBody = this.props.useCustomFormat ?       
            <div>{resultContent}</div>
            :       (<div className="grid-body">
                        {this.props.showTableHeading ? <table className={headerTableClassName}>
                            <GridTitle columns={cols} changeSort={this.changeSort} sortColumn={this.state.sortColumn} sortAscending={this.state.sortAscending} columnMetadata={this.props.columnMetadata}/>
                        </table> : ""}
                        {resultContent}
                        </div>);

        if (typeof this.state.results === 'undefined' || this.state.results.length === 0) {
            var myReturn = null; 
            if (this.props.customNoData != null) {
                myReturn = (<div className={gridClassName}><this.props.customNoData /></div>);

                return myReturn
            }

            myReturn = (<div className={gridClassName}>
                    {topSection}
                    <GridNoData noDataMessage={this.props.noDataMessage} />
                </div>);
            return myReturn;

        }


        return (
            <div className={gridClassName}>
                {topSection}
                {columnSelector}
                <div className="grid-container panel">
                    {gridBody}
                    {that.props.showPager ? <div className="grid-footer clearfix">
                        {pagingContent}
                    </div> : ""}
                </div>
            </div>
        );

    }
});

module.exports = Griddle;
