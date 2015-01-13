var React = require('react');
var Griddle = require('./griddle.jsx');
var _ = require('underscore');

var GriddleWithCallback = React.createClass({
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
			if (that.props.infiniteScroll && that.state.results) {
				state.results = that.state.results.concat(externalResults.results);
			} else {
				state.results = externalResults.results;
			}

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
			var loadingResults = this.props.infiniteScroll ? this.state.results : [{"fake":"forLoading"}];
			var maxPage = this.props.infiniteScroll ? this.state.page : this.state.max;

			return <Griddle {...this.props} useExternal={true} externalSetPage={this.setPage}
		        externalChangeSort={this.changeSort} externalSetFilter={this.setFilter}
		        externalSetPageSize={this.setPageSize} externalMaxPage={maxPage}
		        externalCurrentPage={this.state.page} results={loadingResults} tableClassName="table" resultsPerPage={this.state.pageSize}
		        externalSortColumn={this.state.sortColumn} externalSortAscending={this.state.sortAscending}
				useCustomFormat="true" customFormat={this.props.loadingComponent} />
		}

		return <Griddle {...this.props} useExternal={true} externalSetPage={this.setPage}
			externalChangeSort={this.changeSort} externalSetFilter={this.setFilter}
			externalSetPageSize={this.setPageSize} externalMaxPage={this.state.maxPage}
			externalCurrentPage={this.state.page} results={this.state.results} tableClassName="table" resultsPerPage={this.state.pageSize}
			externalSortColumn={this.state.sortColumn} externalSortAscending={this.state.sortAscending} />
    }
});

module.exports = GriddleWithCallback;
