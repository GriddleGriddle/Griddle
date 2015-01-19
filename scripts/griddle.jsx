/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var GridTable = require('./gridTable.jsx');
var GridFilter = require('./gridFilter.jsx');
var GridPagination = require('./gridPagination.jsx');
var GridSettings = require('./gridSettings.jsx');
var GridTitle = require('./gridTitle.jsx');
var GridNoData = require('./gridNoData.jsx');
var CustomRowComponentContainer = require('./customRowComponentContainer.jsx');
var CustomPaginationContainer = require('./customPaginationContainer.jsx');
var _ = require('underscore');

var Griddle = React.createClass({
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
            "customRowComponentClassName":"",
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
            "useGriddleStyles": true,
            "useGriddleIcons": true,
            "customRowComponent": null,
            "customGridComponent": null,
            "customPagerComponent": {},
            "enableToggleCustom":false,
            "noDataMessage":"There is no data to display.",
            "customNoDataComponent": null,
            "showTableHeading":true,
            "showPager":true,
            "useFixedHeader":false,
            "useExternal": false,
            "externalSetPage": null,
            "externalChangeSort": null,
            "externalSetFilter": null,
            "externalSetPageSize":null,
            "externalMaxPage":null,
            "externalCurrentPage": null,
            "externalSortColumn": null,
            "externalSortAscending": true,
            "externalLoadingComponent": null,
            "externalIsLoading": false,
            "enableInfiniteScroll": false,
            "bodyHeight": null,
            "infiniteScrollSpacerHeight": 50,
            "useFixedLayout": true,
            "isSubGriddle": false,
            "enableSort": true,
            /* css class names */
            "sortAscendingClassName": "sort-ascending",
            "sortDescendingClassName": "sort-descending",
            "parentRowCollapsedClassName": "parent-row",
            "parentRowExpandedClassName": "parent-row expanded",
            "settingsToggleClassName": "settings",
            "nextClassName": "griddle-next",
            "previousClassName": "griddle-previous",
            /* icon components */
            "sortAscendingComponent": " ▲",
            "sortDescendingComponent": " ▼",
            "parentRowCollapsedComponent": "▶",
            "parentRowExpandedComponent": "▼",
            "settingsIconComponent": "",
            "nextIconComponent": "",
            "previousIconComponent":""
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
    toggleCustomComponent: function(){
        if(this.state.customComponentType === "grid"){
            this.setProps({
                useCustomGridComponent: !this.props.useCustomGridComponent
            });
        } else if(this.state.customComponentType === "row"){
            this.setProps({
                useCustomRowComponent: !this.props.useCustomRowComponent
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
          this.setState({page: 0, maxPage: maxPage, filteredColumns: this.props.columns });
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
        if(this.props.enableSort === false){ return; }
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
            showColumnChooser: false
        };

        return state;
    },
    componentWillMount: function() {
        this.verifyExternal();
        this.verifyCustom();
        this.setMaxPage();
        //don't like the magic strings
        if(this.props.useCustomGridComponent === true){
            this.setState({
                 customComponentType: "grid"
            });
        } else if(this.props.useCustomRowComponent === true){
            this.setState({
                customComponentType: "row"
            });
        } else {
          this.setState({
            filteredColumns: this.props.columns
          })
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
        if(this.props.useCustomGridComponent === true && this.props.customGridComponent === null){
            console.error("useCustomGridComponent is set to true but no custom component was specified.")
        }
        if (this.props.useCustomRowComponent === true && this.props.customRowComponent === null){
            console.error("useCustomRowComponent is set to true but no custom component was specified.")
        }
        if(this.props.useCustomGridComponent === true && this.props.useCustomRowComponent === true){
            console.error("Cannot currently use both customGridComponent and customRowComponent.");
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
      // If a custom pager is included, don't allow for infinite scrolling.
      if (this.props.useCustomPagerComponent) {
        return false;
      }

      // Otherwise, send back the property.
      return this.props.enableInfiniteScroll;
    },
    render: function() {
        var clearFix = {
                    clear: "both",
                    display: "table",
                    width: "100%"
        };

        var that = this,
            results = this.getCurrentResults();  // Attempt to assign to the filtered results, if we have any.

        var headerTableClassName = this.props.tableClassName + " table-header";

        //figure out if we want to show the filter section
        var filter = (this.props.showFilter && this.props.useCustomGridComponent === false) ? <GridFilter changeFilter={this.setFilter} placeholderText={this.props.filterPlaceholderText} /> : "";
        var settings = this.props.showSettings ? <button type="button" className={this.props.settingsToggleClassName} onClick={this.toggleColumnChooser} style={this.props.useGriddleStyles ? { background: "none", border: "none", padding: 0, margin: 0, fontSize: 14} : null}>{this.props.settingsText}{this.props.settingsIconComponent}</button> : "";

        //if we have neither filter or settings don't need to render this stuff
        var topSection = "";
        if (this.props.showFilter || this.props.showSettings){
            var filterStyles = null,
                settingsStyles = null,
                topContainerStyles = null;

            if(this.props.useGriddleStyles){
                filterStyles = {
                    "float": "left",
                    width: "50%",
                    textAlign: "left",
                    color: "#222",
                    minHeight: "1px"
                };

                settingsStyles= {
                    "float": "left",
                    width: "50%",
                    textAlign: "right"
                };

                topContainerStyles = clearFix;
            }

           topSection = (
            <div className="top-section" style={topContainerStyles}>
                <div className="griddle-filter" style={filterStyles}>
                   {filter}
                </div>
                <div className="griddle-settings-toggle" style={settingsStyles}>
                    {settings}
                </div>
            </div>);
        }

        var resultContent = "";
        var pagingContent = "";
        var keys = [];
        var cols = this.getColumns();

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

        // Grab the paging content if it's to be displayed
        if (this.props.showPager && !this.isInfiniteScrollEnabled() && !this.props.useCustomGridComponent) {
            pagingContent = (
              <div className="griddle-footer">
                  {this.props.useCustomPagerComponent ?
                      <CustomPaginationContainer next={this.nextPage} previous={this.previousPage} currentPage={currentPage} maxPage={maxPage} setPage={this.setPage} nextText={this.props.nextText} previousText={this.props.previousText} customPagerComponent={this.props.customPagerComponent}/> :
                      <GridPagination useGriddleStyles={this.props.useGriddleStyles} next={this.nextPage} previous={this.previousPage} nextClassName={this.props.nextClassName} nextIconComponent={this.props.nextIconComponent} previousClassName={this.props.previousClassName} previousIconComponent={this.props.previousIconComponent} currentPage={currentPage} maxPage={maxPage} setPage={this.setPage} nextText={this.props.nextText} previousText={this.props.previousText}/>
                  }
              </div>
          );
        }

        //clean this stuff up so it's not if else all over the place. ugly if
        if(this.props.useCustomGridComponent && this.props.customGridComponent !== null){
            //this should send all the results it has
            resultContent = <this.props.customGridComponent data={this.props.results} className={this.props.customGridComponentClassName} />
        } else if(this.props.useCustomRowComponent){
            resultContent = <div><CustomRowComponentContainer data={data} columns={cols} metadataColumns={meta}
                className={this.props.customRowComponentClassName} customComponent={this.props.customRowComponent}
                style={clearFix} />{this.props.showPager&&pagingContent}</div>
        } else {
            resultContent = (<div className='griddle-body'><GridTable useGriddleStyles={this.props.useGriddleStyles} isSubGriddle={this.props.isSubGriddle}
              useGriddleIcons={this.props.useGriddleIcons} useFixedLayout={this.props.useFixedLayout} columnMetadata={this.props.columnMetadata}
              showPager={this.props.showPager} pagingContent={pagingContent} data={data} columns={cols} metadataColumns={meta} className={this.props.tableClassName}
              enableInfiniteScroll={this.isInfiniteScrollEnabled()} enableSort={this.props.enableSort} nextPage={this.nextPage} changeSort={this.changeSort} sortColumn={this.getCurrentSort()}
              sortAscending={this.getCurrentSortAscending()} showTableHeading={this.props.showTableHeading} useFixedHeader={this.props.useFixedHeader}
              sortAscendingClassName={this.props.sortAscendingClassName} sortDescendingClassName={this.props.sortDescendingClassName}
              parentRowCollapsedClassName={this.props.parentRowCollapsedClassName} parentRowExpandedClassName={this.props.parentRowExpandedClassName}
              sortAscendingComponent={this.props.sortAscendingComponent} sortDescendingComponent={this.props.sortDescendingComponent}
              parentRowCollapsedComponent={this.props.parentRowCollapsedComponent} parentRowExpandedComponent={this.props.parentRowExpandedComponent}
              bodyHeight={this.props.bodyHeight} infiniteScrollSpacerHeight={this.props.infiniteScrollSpacerHeight} externalLoadingComponent={this.props.externalLoadingComponent}
              externalIsLoading={this.props.externalIsLoading} hasMorePages={hasMorePages} /></div>)
        }



        var columnSelector = this.state.showColumnChooser ? (
            <GridSettings columns={keys} selectedColumns={cols} setColumns={this.setColumns} settingsText={this.props.settingsText}
             settingsIconComponent={this.props.settingsIconComponent} maxRowsText={this.props.maxRowsText} setPageSize={this.setPageSize}
             showSetPageSize={!this.props.useCustomGridComponent} resultsPerPage={this.props.resultsPerPage} enableToggleCustom={this.props.enableToggleCustom}
             toggleCustomComponent={this.toggleCustomComponent} useCustomComponent={this.props.useCustomRowComponent || this.props.useCustomGridComponent}
             useGriddleStyles={this.props.useGriddleStyles} enableCustomFormatText={this.props.enableCustomFormatText} columnMetadata={this.props.columnMetadata} />
        ) : "";

        var gridClassName = this.props.gridClassName.length > 0 ? "griddle " + this.props.gridClassName : "griddle";
        //add custom to the class name so we can style it differently
        gridClassName += this.props.useCustomRowComponent ? " griddle-custom" : "";

        if (typeof results === 'undefined' || results.length === 0 && this.props.useExternal === false && this.props.externalIsLoading === false) {
            var myReturn = null;
            if (this.props.customNoDataComponent != null) {
                myReturn = (<div className={gridClassName}><this.props.customNoDataComponent /></div>);

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
                <div className="griddle-container" style={this.props.useGriddleStyles&&!this.props.isSubGriddle? { border: "1px solid #DDD"} : null }>
                    {resultContent}
                </div>
            </div>
        );

    }
});

module.exports = Griddle;
