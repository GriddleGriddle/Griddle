/** @jsx React.DOM */

/* 
   Griddle - Simple Grid Component for React 
   https://github.com/DynamicTyped/Griddle
   2014 Ryan Lanciaux
*/
var Griddle = React.createClass({
    /* set just some of the state properties and re-render*/ 
    mergeState: function(object) {
        this.setState(_.extend(this.state, object));
    },
    getDefaultProps: function() {
        return{
            "columns": [],
            "resultsPerPage":10,
            "results": [],
            "initialSort": "",
            "gridClassName":"",
            "settingsText": "Settings",
            "filterPlaceholder": "Filter Results",
            "nextText": "Next",
            "previousText": "Previous",
            //this column will determine which column holds subgrid data
            //it will be passed through with the data object but will not be rendered
            "childrenColumnName": "children",
            //Any column in this list will be treated as metadata and will be passed through with the data but won't be rendered
            "metadataColumns": []
        };
    },
    /* if we have a filter display the max page and results accordingly */
    setFilter: function(filter) {
        if(filter){
            var filtered = _.filter(this.props.results, 
                function(item) { 
                    var arr = _.values(item); 
                    for(var i = 0; i < arr.length; i++){
                       if ((arr[i]||"").toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0){
                        return true; 
                       } 
                    }

                    return false; 
                });
            this.mergeState({
                page: 0,
                filteredResults: filtered,
                filter: filter,
                maxPage: this.getMaxPage(filtered)
            });
        } else { 
            this.mergeState({
                filteredResults: null, 
                filter: filter,
                maxPage: this.getMaxPage(null)
            });
        }
    },
    toggleColumnChooser: function(){
        this.mergeState({
            showColumnChooser: this.state.showColumnChooser == false
        });
    },
    getMaxPage: function(results){
        var maxPage = Math.ceil((results||this.props.results).length / this.props.resultsPerPage);
        return maxPage;
    },
    setMaxPage: function(results){
        var maxPage = this.getMaxPage();
        //re-render if we have new max page value
        if (this.state.maxPage != maxPage){
            this.mergeState({ maxPage: maxPage, filteredColumns: this.props.columns });
        }
    },
    setPage: function(number) {
       //check page size and move the filteredResults to pageSize * pageNumber 
        if (number * this.props.resultsPerPage <= this.props.resultsPerPage * this.state.maxPage) {
            this.mergeState({
                page: number
            });
        }
    },
    getColumns: function(){
        //if we don't have any data don't mess with this
        if (this.props.results.length == 0){ return [];}

        //if we didn't set default or filter
        if (this.state.filteredColumns.length == 0){
            return _.keys(this.props.results[0]); 
        }

        return this.state.filteredColumns; 
    },
    setColumns: function(columns){
        columns = _.isArray(columns) ? columns : [columns];
        this.mergeState({
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

        this.mergeState({
            page:0,
            sortColumn: sort, 
            sortAscending: sortAscending
        });
    },
    componentWillMount: function() {
        this.setMaxPage();
    },
    componentWillReceiveProps: function(nextProps) {
        this.setMaxPage(nextProps.results);
    },
    getInitialState: function() {
        return {
            maxPage: 0,
            page: 0,
            filteredResults: null,
            filteredColumns: [],
            filter: "",
            sortColumn: "",
            sortAscending: true,
            showColumnChooser: false,
        };
    },
    getDataForRender: function(data, cols, pageList){
        var that = this; 
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
        var that = this; 
        //figure out which columns are displayed and show only those
        var cols = this.getColumns(); 

        data =  this.getDataForRender(this.state.filteredResults||this.props.results, cols, true);

        var keys = _.keys(this.props.results[0]);

        var meta = this.props.metadataColumns;
        meta.push(this.props.childrenColumnName); 

        var columnSelector = this.state.showColumnChooser ? (
                                <div className="row">
                                    <div className="col-md-12">
                                        <GridColumns columns={keys} selectedColumns={this.getColumns()} setColumns={this.setColumns}/>
                                    </div>
                                </div>
                            ) : "";

        var headerTableClassName = this.props.gridClassName + " table-header";

        return (
            <div className="griddle">
                <div className="row">
                    <div className="col-md-6">
                        <GridFilter changeFilter={this.setFilter} placeholderText={this.props.filterPlaceholder} />
                    </div>
                    <div className="col-md-6 right">
                        <span className="settings" onClick={this.toggleColumnChooser}>{this.props.settingsText} <i className="glyphicon glyphicon-cog"></i></span>
                    </div>
                </div>
                {columnSelector}
                <div className="grid-container panel">
                    <div className="grid-body">
                        <table className={headerTableClassName}>
                            <GridTitle columns={this.getColumns()} changeSort={this.changeSort} sortColumn={this.state.sortColumn} sortAscending={this.state.sortAscending}/>
                        </table>
                        <GridBody data= {data} columns={cols} metadataColumns={meta} className={this.props.gridClassName}/>        
                    </div>
                    <div className="grid-footer">
                        <GridPagination next={this.nextPage} previous={this.previousPage} currentPage={this.state.page} maxPage={this.state.maxPage} setPage={this.setPage} nextText={this.props.nextText} previousText={this.props.previousText}/>
                    </div>
                </div>
            </div>
        );
    }
});

var GridColumns = React.createClass({
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
        return (<div className="columnSelector panel">{nodes}</div>);
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
                <div className="col-md-4">{previous}</div>
                <div className="col-md-4 center">
                    <select value={this.props.currentPage+1} onChange={this.pageChange}> 
                        {options} 
                    </select> / {this.props.maxPage}
                </div>
                <div className="col-md-4 right">{next}</div>
            </div>
        )
    }
})
