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
var GridNoData = require('./gridNoData.jsx');
var GridRow = require('./gridRow.jsx');
var GridRowContainer = require('./gridRowContainer.jsx');
var CustomRowComponentContainer = require('./customRowComponentContainer.jsx');
var CustomPaginationContainer = require('./customPaginationContainer.jsx');
var CustomFilterContainer = require('./customFilterContainer.jsx');
var ColumnProperties = require('./columnProperties');
var RowProperties = require('./rowProperties');
var deep = require('./deep');

var drop = require('lodash.drop');
var dropRight = require('lodash.dropright');
var find = require('lodash.find');
var first = require('lodash.take');
var forEach = require('lodash.foreach');
var initial = require('lodash.initial');
var isArray = require('lodash.isarray');
var isEmpty = require('lodash.isempty');
var isNull = require('lodash.isnull');
var isUndefined = require('lodash.isundefined');
var omit = require('lodash.omit');
var map = require('lodash.map');
var sortBy = require('lodash.sortby');
var extend = require('lodash.assign');
var _filter = require('lodash.filter');

var Griddle = React.createClass({
    statics: {
        GridTable: GridTable,
        GridFilter: GridFilter,
        GridPagination: GridPagination,
        GridSettings: GridSettings,
        GridRow: GridRow
    },
    columnSettings: null,
    rowSettings: null,
    getDefaultProps: function() {
        return{
            "columns": [],
            "gridMetadata": null,
            "columnMetadata": [],
            "rowMetadata": null,
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
            "enableToggleCustom":false,
            "noDataMessage":"There is no data to display.",
            "noDataClassName": "griddle-nodata",
            "customNoDataComponent": null,
            "allowEmptyGrid": false,
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
            "sortDefaultComponent":null,
            "parentRowCollapsedComponent": "▶",
            "parentRowExpandedComponent": "▼",
            "settingsIconComponent": "",
            "nextIconComponent": "",
            "previousIconComponent":"",
            "isMultipleSelection": false, //currently does not support subgrids
            "selectedRowIds": [],
            "uniqueIdentifier": "id"
        };
    },
    propTypes: {
        isMultipleSelection: React.PropTypes.bool,
        selectedRowIds: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.number),
            React.PropTypes.arrayOf(React.PropTypes.string)
        ]),
        uniqueIdentifier: React.PropTypes.string
    },
    defaultFilter: function(results, filter) {
      return _filter(results,
      function(item) {
           var arr = deep.keys(item);
           for(var i = 0; i < arr.length; i++){
              if ((deep.getAt(item, arr[i])||"").toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0){
               return true;
              }
           }
           return false;
       });
    },

    filterByColumnFilters(columnFilters) {
      var filteredResults = Object.keys(columnFilters).reduce(function(previous, current) {
        return _filter(
          previous,
          function(item) {
            if(deep.getAt(item, current || "").toString().toLowerCase().indexOf(columnFilters[current].toLowerCase()) >= 0) {
              return true;
            }

            return false;
          }
        )
      }, this.props.results)

      var newState = {
        columnFilters: columnFilters
      };

      if(columnFilters) {
        newState.filteredResults = filteredResults;
        newState.maxPage = this.getMaxPage(newState.filteredResults);
      } else if(this.state.filter) {
        newState.filteredResults = this.props.useCustomFilterer ?
          this.props.customFilterer(this.props.results, filter) :
          this.defaultFilter(this.props.results, filter);
      } else {
        newState.filteredResults = null;
      }

      this.setState(newState);
    },

    filterByColumn: function(filter, column) {
      var columnFilters = this.state.columnFilters;

      //if filter is "" remove it from the columnFilters object
      if(columnFilters.hasOwnProperty(column) && !filter) {
        columnFilters = omit(columnFilters, column);
      } else {
        var newObject = {};
        newObject[column] = filter;
        columnFilters = extend({}, columnFilters, newObject);
      }

      this.filterByColumnFilters(columnFilters);
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
        updatedState.filteredResults = this.props.useCustomFilterer ?
          this.props.customFilterer(this.props.results, filter) :
          this.defaultFilter(this.props.results, filter);

        // Update the max page.
        updatedState.maxPage = that.getMaxPage(updatedState.filteredResults);

        //if filter is null or undefined reset the filter.
        if (isUndefined(filter) || isNull(filter) || isEmpty(filter)){
            updatedState.filter = filter;
            updatedState.filteredResults = null;
        }

        // Set the state.
        that.setState(updatedState);

		this._resetSelectedRows();
    },
    setPageSize: function(size){
        if(this.props.useExternal) {
            this.props.externalSetPageSize(size);
            return;
        }

        //make this better.
        this.state.resultsPerPage = size;
        this.setMaxPage();
    },
    toggleColumnChooser: function(){
        this.setState({
            showColumnChooser: !this.state.showColumnChooser
        });
    },
    isNullOrUndefined: function(value) {
      return (value === undefined || value === null)
    },
    shouldUseCustomRowComponent: function() {
      return this.isNullOrUndefined(this.state.useCustomRowComponent) ?
        this.props.useCustomRowComponent :
        this.state.useCustomRowComponent
    },
    shouldUseCustomGridComponent: function() {
      return this.isNullOrUndefined(this.state.useCustomGridComponent) ?
        this.props.useCustomGridComponent :
        this.state.useCustomGridComponent
    },
    toggleCustomComponent: function(){
        if(this.state.customComponentType === "grid"){
            this.setState({
                useCustomGridComponent: !this.shouldUseCustomGridComponent()
            });
        } else if(this.state.customComponentType === "row"){
            this.setState({
                useCustomRowComponent: !this.shouldUseCustomRowComponent()
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
        var maxPage = Math.ceil(totalResults / this.state.resultsPerPage);
        return maxPage;
    },
    setMaxPage: function(results){
        var maxPage = this.getMaxPage(results);
        //re-render if we have new max page value
        if (this.state.maxPage !== maxPage){
          this.setState({page: 0, maxPage: maxPage, filteredColumns: this.columnSettings.filteredColumns });
        }
    },
    setPage: function(number) {
        if(this.props.useExternal) {
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
		if(this.props.enableInfiniteScroll) {
			this.setState({
				isSelectAllChecked: false
			})
		} else { //When the paging is done on the server, the previously selected rows on a certain page might not
			// coincide with the new rows on that exact page page, if moving back and forth. Better reset the selection
			this._resetSelectedRows();
		}
    },
    setColumns: function(columns){
        this.columnSettings.filteredColumns = isArray(columns) ? columns : [columns];

        this.setState({
            filteredColumns: this.columnSettings.filteredColumns
        });
    },
    nextPage: function() {
        var currentPage = this.getCurrentPage();
        if (currentPage < this.getCurrentMaxPage() - 1) { this.setPage(currentPage + 1); }
    },
    previousPage: function() {
      var currentPage = this.getCurrentPage();
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

		//When the sorting is done on the server, the previously selected rows might not correspond with the new ones.
		//Better reset the selection
		this._resetSelectedRows();
    },
    componentWillReceiveProps: function(nextProps) {
        this.setMaxPage(nextProps.results);
	//This will updaet the column Metadata
	this.columnSettings.columnMetadata = nextProps.columnMetadata;
        if(nextProps.results.length > 0)
        {
            var deepKeys = deep.keys(nextProps.results[0]);

            var is_same = (this.columnSettings.allColumns.length == deepKeys.length) && this.columnSettings.allColumns.every(function(element, index) {
                return element === deepKeys[index];
            });

            if(!is_same) {
                this.columnSettings.allColumns = deepKeys;
            }
        }
        else if(this.columnSettings.allColumns.length > 0)
        {
            this.columnSettings.allColumns = [];
        }

        if(nextProps.columns !== this.columnSettings.filteredColumns){
            this.columnSettings.filteredColumns = nextProps.columns;
        }


        if(nextProps.selectedRowIds) {
            var visibleRows = this.getDataForRender(this.getCurrentResults(), this.columnSettings.getColumns(), true);

            this.setState({
                isSelectAllChecked: this._getAreAllRowsChecked(nextProps.selectedRowIds, map(visibleRows, this.props.uniqueIdentifier)),
                selectedRowIds: nextProps.selectedRowIds
            });
        }
    },
    getInitialState: function() {
        var state =  {
            maxPage: 0,
            page: 0,
            filteredResults: null,
            filteredColumns: [],
            filter: "",
            //this sets the individual column filters
            columnFilters: {},
            resultsPerPage: this.props.resultsPerPage || 5,
            sortColumn: this.props.initialSort,
            sortAscending: this.props.initialSortAscending,
            showColumnChooser: false,
			isSelectAllChecked: false,
			selectedRowIds: this.props.selectedRowIds
        };

        return state;
    },
    componentWillMount: function() {
        this.verifyExternal();
        this.verifyCustom();

        this.columnSettings = new ColumnProperties(
            this.props.results.length > 0 ? deep.keys(this.props.results[0]) : [],
            this.props.columns,
            this.props.childrenColumnName,
            this.props.columnMetadata,
            this.props.metadataColumns
        );

        this.rowSettings = new RowProperties(
            this.props.rowMetadata,
            (this.props.useCustomTableRowComponent && this.props.customTableRowComponent) ?
                this.props.customTableRowComponent :
                GridRow,
            this.props.useCustomTableRowComponent
        );

        this.setMaxPage();

        //don't like the magic strings
        if(this.shouldUseCustomGridComponent()){
            this.setState({
                 customComponentType: "grid"
            });
        } else if(this.shouldUseCustomRowComponent()){
            this.setState({
                customComponentType: "row"
            });
        } else {
          this.setState({
            filteredColumns: this.columnSettings.filteredColumns
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
    //TODO: Do this with propTypes
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
        if(this.props.useCustomFilterer === true && this.props.customFilterer === null){
            console.error("useCustomFilterer is set to true but no custom filter function was specified.");
        }
        if(this.props.useCustomFilterComponent === true && this.props.customFilterComponent === null){
            console.error("useCustomFilterComponent is set to true but no customFilterComponent was specified.");
        }
    },
    getDataForRender: function(data, cols, pageList){
        var that = this;
            //get the correct page size
            if(this.state.sortColumn !== "" || this.props.initialSort !== ""){
                var sortColumn = _filter(this.props.columnMetadata, {columnName: this.state.sortColumn});
                var sortProperty = sortColumn.length > 0 && sortColumn[0].hasOwnProperty("sortProperty") && sortColumn[0]["sortProperty"] || null;
                // for underscore-style sortBy method (with 1 argument)
                var compare = sortColumn.length > 0 && sortColumn[0].hasOwnProperty("compare") && sortColumn[0]["compare"] || null;
                // for standard JS sort method (with 2 arguments)
                var compare2 = sortColumn.length > 0 && sortColumn[0].hasOwnProperty("compare2") && sortColumn[0]["compare2"] || null;
                var column = that.state.sortColumn || that.props.initialSort;

                if(compare2){
                    data = data.sort(function (a, b) {
                        return compare2(deep.getAt(a, column), deep.getAt(b, column));
                    });
                } else {
                    data = sortBy(data, function (item) {
                        if(sortProperty){
                            return deep.getAt(item, column)[sortProperty];
                        } else if(compare){
                            return compare(deep.getAt(item, column));
                        } else {
                            return deep.getAt(item, column);
                        }
                    });
                }

                if(this.state.sortAscending === false){
                    data.reverse();
                }
            }

            var currentPage = this.getCurrentPage();

            if (!this.props.useExternal && pageList && (this.state.resultsPerPage * (currentPage+1) <= this.state.resultsPerPage * this.state.maxPage) && (currentPage >= 0)) {
                if (this.isInfiniteScrollEnabled()) {
                  // If we're doing infinite scroll, grab all results up to the current page.
                  data = first(data, (currentPage + 1) * this.state.resultsPerPage);
                } else {
                  //the 'rest' is grabbing the whole array from index on and the 'initial' is getting the first n results
                  var rest = drop(data, currentPage * this.state.resultsPerPage);
                  data = (dropRight || initial)(rest, rest.length-this.state.resultsPerPage);
                }
            }

        var meta = this.columnSettings.getMetadataColumns;

        var transformedData = [];

        for(var i = 0; i<data.length; i++){
            var mappedData = data[i];

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
    //This takes the props relating to sort and puts them in one object
    getSortObject: function(){
        return {
            enableSort: this.props.enableSort,
            changeSort: this.changeSort,
            sortColumn: this.getCurrentSort(),
            sortAscending: this.getCurrentSortAscending(),
            sortAscendingClassName: this.props.sortAscendingClassName,
            sortDescendingClassName: this.props.sortDescendingClassName,
            sortAscendingComponent: this.props.sortAscendingComponent,
            sortDescendingComponent: this.props.sortDescendingComponent,
            sortDefaultComponent: this.props.sortDefaultComponent
        }
    },
	_toggleSelectAll: function () {
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
	},
	_toggleSelectRow: function (row, isChecked) {

        var visibleRows = this.getDataForRender(this.getCurrentResults(), this.columnSettings.getColumns(), true),
            newSelectedRowIds = JSON.parse(JSON.stringify(this.state.selectedRowIds));

        this._updateSelectedRowIds(row[this.props.uniqueIdentifier], newSelectedRowIds, isChecked);

		this.setState({
			isSelectAllChecked: this._getAreAllRowsChecked(newSelectedRowIds, map(visibleRows, this.props.uniqueIdentifier)),
            selectedRowIds: newSelectedRowIds
		});
	},
    _updateSelectedRowIds: function (id, selectedRowIds, isChecked) {

        var isFound;

        if(isChecked) {
            isFound = find(selectedRowIds, function (item) {
                return id === item;
            });

            if(isFound === undefined) {
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

        if(selectedRowIds.length !== visibleRowIds.length) {
            return false;
        }

        for(i = 0; i < selectedRowIds.length; i++) {
            isFound = find(visibleRowIds, function (visibleRowId) {
                return selectedRowIds[i] === visibleRowId;
            });

            if(isFound === undefined) {
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
		})
	},
	//This takes the props relating to multiple selection and puts them in one object
	getMultipleSelectionObject: function(){

		return {
			isMultipleSelection: find(this.props.results, function (result) { return 'children' in result}) ? false : this.props.isMultipleSelection, //does not support subgrids
			toggleSelectAll: this._toggleSelectAll,
			getIsSelectAllChecked: this._getIsSelectAllChecked,

			toggleSelectRow: this._toggleSelectRow,
			getSelectedRowIds: this.getSelectedRowIds,
            getIsRowChecked: this._getIsRowChecked
		}
	},
    isInfiniteScrollEnabled: function(){
      // If a custom pager is included, don't allow for infinite scrolling.
      if (this.props.useCustomPagerComponent) {
        return false;
      }

      // Otherwise, send back the property.
      return this.props.enableInfiniteScroll;
    },
    getClearFixStyles: function(){
        return {
            clear: "both",
            display: "table",
            width: "100%"
        };
    },
    getSettingsStyles: function(){
       return {
            "float": "left",
            width: "50%",
            textAlign: "right"
        };
    },
    getFilterStyles: function(){
        return {
            "float": "left",
            width: "50%",
            textAlign: "left",
            color: "#222",
            minHeight: "1px"
        };
    },
    getFilter: function(){
     return ((this.props.showFilter && this.shouldUseCustomGridComponent() === false) ?
        ( this.props.useCustomFilterComponent ?
         <CustomFilterContainer changeFilter={this.setFilter} placeholderText={this.props.filterPlaceholderText} customFilterComponent={this.props.customFilterComponent} results={this.props.results} currentResults={this.getCurrentResults()} /> :
         <GridFilter changeFilter={this.setFilter} placeholderText={this.props.filterPlaceholderText} />) :
        "");
    },
    getSettings: function(){
        return (this.props.showSettings ?
            <button type="button" className={this.props.settingsToggleClassName} onClick={this.toggleColumnChooser}
                style={this.props.useGriddleStyles ? { background: "none", border: "none", padding: 0, margin: 0, fontSize: 14} : null}>
                    {this.props.settingsText}{this.props.settingsIconComponent}
            </button> :
            "");
    },
    getTopSection: function(filter, settings){
        if (this.props.showFilter === false && this.props.showSettings === false){
            return "";
        }

        var filterStyles = null,
            settingsStyles = null,
            topContainerStyles = null;

        if(this.props.useGriddleStyles){
            filterStyles = this.getFilterStyles();
            settingsStyles= this.getSettingsStyles();

            topContainerStyles = this.getClearFixStyles();
        }

       return (
        <div className="top-section" style={topContainerStyles}>
            <div className="griddle-filter" style={filterStyles}>
               {filter}
            </div>
            <div className="griddle-settings-toggle" style={settingsStyles}>
                {settings}
            </div>
        </div>);
    },
    getPagingSection: function(currentPage, maxPage){
        if ((this.props.showPager && !this.isInfiniteScrollEnabled() && !this.shouldUseCustomGridComponent()) === false) {
            return undefined;
        }

        return (
          <div className="griddle-footer">
              {this.props.useCustomPagerComponent ?
                  <CustomPaginationContainer next={this.nextPage} previous={this.previousPage} currentPage={currentPage} maxPage={maxPage} setPage={this.setPage} nextText={this.props.nextText} previousText={this.props.previousText} customPagerComponent={this.props.customPagerComponent}/> :
                  <GridPagination useGriddleStyles={this.props.useGriddleStyles} next={this.nextPage} previous={this.previousPage} nextClassName={this.props.nextClassName} nextIconComponent={this.props.nextIconComponent} previousClassName={this.props.previousClassName} previousIconComponent={this.props.previousIconComponent} currentPage={currentPage} maxPage={maxPage} setPage={this.setPage} nextText={this.props.nextText} previousText={this.props.previousText}/>
              }
          </div>
        );
    },
    getColumnSelectorSection: function(keys, cols){
        return this.state.showColumnChooser ? (
            <GridSettings columns={keys} selectedColumns={cols} setColumns={this.setColumns} settingsText={this.props.settingsText}
             settingsIconComponent={this.props.settingsIconComponent} maxRowsText={this.props.maxRowsText} setPageSize={this.setPageSize}
             showSetPageSize={!this.shouldUseCustomGridComponent()} resultsPerPage={this.state.resultsPerPage} enableToggleCustom={this.props.enableToggleCustom}
             toggleCustomComponent={this.toggleCustomComponent} useCustomComponent={this.shouldUseCustomRowComponent() || this.shouldUseCustomGridComponent()}
             useGriddleStyles={this.props.useGriddleStyles} enableCustomFormatText={this.props.enableCustomFormatText} columnMetadata={this.props.columnMetadata} />
        ) : "";
    },
    getCustomGridSection: function(){
        return <this.props.customGridComponent data={this.props.results} className={this.props.customGridComponentClassName} {...this.props.gridMetadata} />
    },
    getCustomRowSection: function(data, cols, meta, pagingContent, globalData){
        return <div><CustomRowComponentContainer data={data} columns={cols} metadataColumns={meta} globalData={globalData}
            className={this.props.customRowComponentClassName} customComponent={this.props.customRowComponent}
            style={this.props.useGriddleStyles ? this.getClearFixStyles() : null} />{this.props.showPager&&pagingContent}</div>
    },
    getStandardGridSection: function(data, cols, meta, pagingContent, hasMorePages){
        var sortProperties = this.getSortObject();
		var multipleSelectionProperties = this.getMultipleSelectionObject();

        // no data section
        var showNoData = this.shouldShowNoDataSection(data);
        var noDataSection =  this.getNoDataSection();

        return (<div className='griddle-body'><GridTable useGriddleStyles={this.props.useGriddleStyles}
                noDataSection={noDataSection}
                showNoData={showNoData}
                columnSettings={this.columnSettings}
                rowSettings = {this.rowSettings}
                sortSettings={sortProperties}
                multipleSelectionSettings={multipleSelectionProperties}
                filterByColumn={this.filterByColumn}
                isSubGriddle={this.props.isSubGriddle}
                useGriddleIcons={this.props.useGriddleIcons}
                useFixedLayout={this.props.useFixedLayout}
                showPager={this.props.showPager}
                pagingContent={pagingContent}
                data={data}
                className={this.props.tableClassName}
                enableInfiniteScroll={this.isInfiniteScrollEnabled()}
                nextPage={this.nextPage}
                showTableHeading={this.props.showTableHeading}
                useFixedHeader={this.props.useFixedHeader}
                parentRowCollapsedClassName={this.props.parentRowCollapsedClassName}
                parentRowExpandedClassName={this.props.parentRowExpandedClassName}
                parentRowCollapsedComponent={this.props.parentRowCollapsedComponent}
                parentRowExpandedComponent={this.props.parentRowExpandedComponent}
                bodyHeight={this.props.bodyHeight}
                paddingHeight={this.props.paddingHeight}
                rowHeight={this.props.rowHeight}
                infiniteScrollLoadTreshold={this.props.infiniteScrollLoadTreshold}
                externalLoadingComponent={this.props.externalLoadingComponent}
                externalIsLoading={this.props.externalIsLoading}
                hasMorePages={hasMorePages}
                onRowClick={this.props.onRowClick}/></div>)
    },
    getContentSection: function(data, cols, meta, pagingContent, hasMorePages, globalData){
        if(this.shouldUseCustomGridComponent() && this.props.customGridComponent !== null){
           return this.getCustomGridSection();
        } else if(this.shouldUseCustomRowComponent()){
            return this.getCustomRowSection(data, cols, meta, pagingContent, globalData);
        } else {
            return this.getStandardGridSection(data, cols, meta, pagingContent, hasMorePages);
        }
    },
    getNoDataSection: function(){
        if (this.props.customNoDataComponent != null) {
            return (<div className={this.props.noDataClassName}><this.props.customNoDataComponent /></div>);
        }
        return (<GridNoData noDataMessage={this.props.noDataMessage} />);
    },
    shouldShowNoDataSection: function(results){
        if (this.props.allowEmptyGrid) {
          return false;
        }

        return (this.props.useExternal === false && (typeof results === 'undefined' || results.length === 0 )) ||
            (this.props.useExternal === true && this.props.externalIsLoading === false && results.length === 0);
    },
    render: function() {
        var that = this,
        results = this.getCurrentResults();  // Attempt to assign to the filtered results, if we have any.

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
        var hasMorePages = (currentPage + 1) < maxPage;

        // Grab the paging content if it's to be displayed
        var pagingContent = this.getPagingSection(currentPage, maxPage);

        var resultContent = this.getContentSection(data, cols, meta, pagingContent, hasMorePages, this.props.globalData);

        var columnSelector = this.getColumnSelectorSection(keys, cols);

        var gridClassName = this.props.gridClassName.length > 0 ? "griddle " + this.props.gridClassName : "griddle";
        //add custom to the class name so we can style it differently
        gridClassName += this.shouldUseCustomRowComponent() ? " griddle-custom" : "";

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

GridRowContainer.Griddle = module.exports = Griddle;
