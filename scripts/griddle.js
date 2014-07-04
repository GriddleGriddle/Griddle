/** @jsx React.DOM */

/* 
   Griddle - Simple Grid Component for React 
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var Griddle = React.createClass({
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
            if (this.props.getExternalResults !== null) {
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
        if (this.props.getExternalResults !== null) {
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

            if (this.props.getExternalResults !== null) {
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
        if (this.state.page < this.state.maxPage) { this.setPage(this.state.page + 1); }
    },
    previousPage: function() {
        if (this.state.page > 0) { this.setPage(this.state.page - 1); }
    },
    changeSort: function(sort){
        var sortAscending = true; 
        if(this.state.sortColumn == sort){
            sortAscending = this.state.sortAscending == false; 
        } else { 
            sortAscending = true; 
        }

        this.setState({
            page:0,
            sortColumn: sort, 
            sortAscending: sortAscending
        });
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.getExternalResults !== null) {
            // TODO: Confirm
            var state = this.state,
                that = this;

            // Update the state with external results.
            state = this.updateStateWithExternalResults(state, function(updatedState) {
                that.setState(updatedState);
            });
        } else {
            that.setMaxPage(nextProps.results);    
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
        if (this.props.getExternalResults === null) {
            state.results = this.props.results;
        } else {
            state.isLoading = true; // Initialize to 'loading'
        }

        return state;
    },
    componentWillMount: function() {
        if (this.props.getExternalResults === null) {
            this.setMaxPage();
        }
    },
    componentDidMount: function() {
        var state = this.state;
        var that = this;

        if (this.props.getExternalResults !== null) {
            // Update the state with external results when mounting
            state = this.updateStateWithExternalResults(state, function(updatedState) {
                that.setState(updatedState);
                that.setMaxPage();
            });
        }
    },
    getDataForRender: function(data, cols, pageList){
        var that = this; 

        if (this.props.getExternalResults === null) {
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

        var headerTableClassName = this.props.gridClassName + " table-header";

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

        // If we're not loading results, fill the table with legitimate data.
        if (!this.state.isLoading) {
            //figure out which columns are displayed and show only those
            var cols = this.getColumns();

            var data = this.getDataForRender(results, cols, true);
            
            var meta = this.props.metadataColumns;
            meta.push(this.props.childrenColumnName); 

            // Grab the column keys from the first results
            keys = _.keys(_.omit(results[0], meta));

            resultContent = (<GridBody data= {data} columns={cols} metadataColumns={meta} className={this.props.gridClassName}/>);
            pagingContent = (<GridPagination next={this.nextPage} previous={this.previousPage} currentPage={this.state.page} maxPage={this.state.maxPage} setPage={this.setPage} nextText={this.props.nextText} previousText={this.props.previousText}/>);
        } else {
            // Otherwise, display the loading content.
            resultContent = (<div className="loading img-responsive center-block"></div>);
        }

        var columnSelector = this.state.showColumnChooser ? (
            <div className="row">
                <div className="col-md-12">
                    <GridSettings columns={keys} selectedColumns={this.getColumns()} setColumns={this.setColumns} settingsText={this.props.settingsText} maxRowsText={this.props.maxRowsText}  setPageSize={this.setPageSize} resultsPerPage={this.props.resultsPerPage} />
                </div>
            </div>
        ) : "";

        return (
            <div className="griddle">
                {topSection}
                {columnSelector}
                <div className="grid-container panel">
                    <div className="grid-body">
                        <table className={headerTableClassName}>
                            <GridTitle columns={this.getColumns()} changeSort={this.changeSort} sortColumn={this.state.sortColumn} sortAscending={this.state.sortAscending} />
                        </table>
                        {resultContent}
                    </div>
                    <div className="grid-footer">
                        {pagingContent}
                    </div>
                </div>
            </div>
        );
    }
});

var GridSettings = React.createClass({
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
            return <div className="column checkbox"><label><input type="checkbox" name="check" onChange={that.handleChange} checked={checked}  data-name={col}/>{col}</label></div>
        });
        return (<div className="columnSelector panel"><h5>{this.props.settingsText}</h5><div className="container-fluid"><div className="row">{nodes}</div></div><hr />
            <label for="maxRows">{this.props.maxRowsText}:</label> 
            <select class="form-control" onChange={this.setPageSize} value={this.props.resultsPerPage}>
                <option value="5">5</option> 
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            </div>);
    }
});

var GridFilter = React.createClass({
    handleChange: function(event){
        this.props.changeFilter(event.target.value); 
    },
    render: function(){
        return <div className="row filter-container"><div className="col-md-6"><input type="text" name="filter" placeholder={this.props.placeholderText} className="form-control" onChange={this.handleChange} /></div></div>
    }
});

var GridTitle = React.createClass({
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
            return <th onClick={that.sort} data-title={col} className={columnSort}>{col}</th>
        });

        return(
            <thead>
                <tr>
                    {nodes}
                </tr>
            </thead>
        );
    }
});

var GridBody = React.createClass({

    render: function() {
        var that = this; 
        var nodes = this.props.data.map(function(row, index){
            return <GridRowContainer data={row} metadataColumns={that.props.metadataColumns} />
        });

        return (

                <table className={this.props.className}>
                    {nodes}
                </table>
            );
    }
});

var GridRowContainer = React.createClass({
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

        var arr = [];
        var hasChildren = (typeof this.props.data["children"] !== "undefined") && this.props.data["children"].length > 0; 

        arr.push(<GridRow data={this.props.data} metadataColumns={that.props.metadataColumns} hasChildren={hasChildren} toggleChildren={that.toggleChildren} showChildren={that.state.showChildren}/>);

        if(that.state.showChildren){
            var children =  hasChildren && this.props.data["children"].map(function(row, index){
                return <GridRow data={row} metadataColumns={that.props.metadataColumns} isChildRow={true}/>
            });
        }
        
        return <tbody>{that.state.showChildren ? arr.concat(children) : arr}</tbody>
    }
});

var GridRow = React.createClass({
    render: function() {
        var that = this;

        var nodes = _.toArray(_.omit(this.props.data, this.props.metadataColumns)).map(function(col, index) {
            return <td onClick={that.props.toggleChildren}>{col}</td>
        });

        //this is kind of hokey - make it better
        var className = "standard-row"; 

        if(that.props.isChildRow){
            className = "child-row";
        } else if (that.props.hasChildren){
            className = that.props.showChildren ? "parent-row expanded" : "parent-row";
        }

        return (<tr className={className}>{nodes}</tr>);
    }
});

//needs props maxPage, currentPage, nextFunction, prevFunction
var GridPagination = React.createClass({
    pageChange: function(event){
        this.props.setPage(parseInt(event.target.value)-1);
    }, 
    render: function(){
        var previous = ""; 
        var next = ""; 

        if(this.props.currentPage > 0){
            previous = <span onClick={this.props.previous} className="previous"><i className="glyphicon glyphicon-chevron-left"></i>{this.props.previousText}</span>
        }

        if(this.props.currentPage != (this.props.maxPage -1)){
            next = <span onClick={this.props.next} className="next">{this.props.nextText}<i className="glyphicon glyphicon-chevron-right"></i></span>
        }

        var options = [];

        for(var i = 1; i<= this.props.maxPage; i++){
            options.push(<option value={i}>{i}</option>);
        }

        return (
            <div className="row">
                <div className="col-xs-4">{previous}</div>
                <div className="col-xs-4 center">
                    <select value={this.props.currentPage+1} onChange={this.pageChange}> 
                        {options} 
                    </select> / {this.props.maxPage}
                </div>
                <div className="col-xs-4 right">{next}</div>
            </div>
        )
    }
})
