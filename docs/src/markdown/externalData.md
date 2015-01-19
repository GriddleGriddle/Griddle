##External Data##

Often times it is not practical to load all of a grid's data in one request. Griddle supports loading external data through creation of a wrapper component or writing a callback function (the wrapper component is the recommended route). 

####Wrapper Component (recommended)####

Griddle comes with a handful of properties that must be set when working with external data.

<dl>
	<dt>useExternal</dt>
	<dd><strong>bool</strong> - Griddle will run expecting results to be coming from an external source. This affects paging, filtering, sorting, etc. (i.e. Griddle will not sort the local data set but will tell the wrapper component to get the sorted data from the source). Default: false
</dl>

<dl>
	<dt>externalSetPage</dt>
	<dd><strong>function</strong> - The function that will be used to set the page. Default: null</dd>
</dl>
<dl>
	<dt>externalChangeSort</dt>
	<dd><strong>function</strong> - The function that will be used to change the sort. Default: null</dd>
</dl>
<dl>
	<dt>externalSetFilter</dt>
	<dd><strong>function</strong> - The function that will be used to change the filter. Default: null</dd>
</dl>
<dl>
	<dt>externalSetPageSize</dt>
	<dd><strong>function</strong> - The function that will be used to change the number of results per page. Default: null</dd>
</dl>
<dl>
	<dt>externalMaxPage</dt>
	<dd><strong>int</strong> - The max number of pages that can be displayed for the result-set. Default: null</dd>
</dl>
<dl>
	<dt>externalCurrentPage</dt>
	<dd><strong>int</strong> - The page that is currently displayed from the result-set. Default: null</dd>
</dl>
<dl>
	<dt>externalSortColumn</dt>
	<dd><strong>string</strong> - The column name that determines the sort of the result-set Default: null</dd>
</dl>
<dl>
	<dt>externalSortAscending</dt>
	<dd><strong>bool</strong> - Specifies the sort direction for the current sort column. Default: true</dd>
</dl>

<hr />

#####Example Wrapper Component#####
Below is a skeleton wrapper component for dealing with external results in Griddle. This wrapper does not need to be used but it could serve as a decent starting point. 

```
var ExternalComponent = React.createClass({
    getInitialState: function(){
      var initial = { "results": [],
          "currentPage": 0,
          "maxPages": 0,
          "externalResultsPerPage": 5,
          "externalSortColumn":null,
          "externalSortAscending":true
      };

      return initial;
    },
    //general lifecycle methods
    componentWillMount: function(){
    },
    componentDidMount: function(){
	},
	//what page is currently viewed
    setPage: function(index){
    },
    //this will handle how the data is sorted
    sortData: function(sort, sortAscending, data){
	},
	//this changes whether data is sorted in ascending or descending order
    changeSortDirection: function(sort, sortAscending){
    },
    //this method handles the filtering of the data
    setFilter: function(filter){
    },
    //this method handles determining the page size
    setPageSize: function(size){
    },
    render: function(){
      return <Griddle useExternal={true} externalSetPage={this.setPage}
        externalChangeSort={this.changeSort} externalSetFilter={this.setFilter}
        externalSetPageSize={this.setPageSize} externalMaxPage={this.state.maxPages}
        externalCurrentPage={this.state.currentPage} results={this.state.results} 
        resultsPerPage={this.state.externalResultsPerPage} 
        externalSortColumn={this.state.externalSortColumn} 
        externalSortAscending={this.state.externalSortAscending}
        showFilter={true} showSettings={true} />
    }
});
```

<hr />

#####External API Example:#####
The following example uses the [Star Wars API](http://swapi.co/) and the [SWAPI-Wrapper](https://github.com/cfjedimaster/SWAPI-Wrapper). 

First off, the skeleton wrapper was modified to include a get external data method. 

```javascript
getExternalData: function(page){
  var that = this;
  page = page||1

  swapiModule.getStarships(page, function(data) {
   that.setState({
      results: data.results,
      currentPage: page-1,
      maxPages: Math.round(data.count/10)
    })
  });
}
```

The component was then modified to use getExternalData method for changing the pages and obtaining the initial data. Notice that filtering, sorting, etc are not enabled on this example (the next example has all of these options turned on). 

```javascript
var ExternalSwapiComponent = React.createClass({
    getInitialState: function(){
      var initial = { "results": [],
          "currentPage": 0,
          "maxPages": 0,
          "externalResultsPerPage": 10,
          "externalSortColumn":null,
          "externalSortAscending":true,
          "results": []
      };

      return initial;
    },
    componentWillMount: function(){
    },
    componentDidMount: function(){
      this.getExternalData();
    },
    getExternalData: function(page){
   	  ...
    },
    setPage: function(index){
      //This should interact with the data source to get the page at the given index
      index = index > this.state.maxPages ? this.state.maxPages : index < 1 ? 1 : index + 1;
      this.getExternalData(index);
    },
    setPageSize: function(size){
    },
    render: function(){
      //columns={["name", "city", "state", "country"]}
      return <Griddle useExternal={true} externalSetPage={this.setPage} enableSort={false} 
        columns={["name", "model", "manufacturer", "passengers"]}
        externalSetPageSize={this.setPageSize} externalMaxPage={this.state.maxPages}
        externalChangeSort={function(){}} externalSetFilter={function(){}}
        externalCurrentPage={this.state.currentPage} results={this.state.results} tableClassName="table" resultsPerPage={this.state.externalResultsPerPage}
        externalSortColumn={this.state.externalSortColumn} externalSortAscending={this.state.externalSortAscending} />
    }
});
```
@@include('./externalData/external-swapi.html')

<hr />

#####Simulated External Results Example:#####

The following example is using the skeleton template above and simulating what loading results externally could look like (while still using the example data that has been used through-out the Griddle documentation). 

Please keep in mind that a good deal of this code is to simulate the type of actions that would generally take place on a server (or wherever the data is coming from) -- most of the time the functions should deal with passing data back and forth to the source of the data (e.g. an API).


```javascript
var externalData = fakeData.slice(0, 53);
 
var SimulatedExternalComponent = React.createClass({
    getInitialState: function(){
      var initial = { "results": [],
          "currentPage": 0,
          "maxPages": 0,
          "externalResultsPerPage": 5,
          "externalSortColumn":null,
          "externalSortAscending":true,
          "pretendServerData": externalData
      };
 
      return initial;
    },
    componentWillMount: function(){
        this.setState({
            maxPages: Math.round(this.state.pretendServerData.length/this.state.externalResultsPerPage),
            "results": this.state.pretendServerData.slice(0,this.state.externalResultsPerPage)
        })
    },
    setPage: function(index){
      //This should interact with the data source to get the page at the given index
      var number = index === 0 ? 0 : index * this.state.externalResultsPerPage;
      this.setState(
        {
          "results": this.state.pretendServerData.slice(number, number+5>this.state.pretendServerData.length ? this.state.pretendServerData.length : number+this.state.externalResultsPerPage),
          "currentPage": index
        });
    },
    sortData: function(sort, sortAscending, data){
      //sorting should generally happen wherever the data is coming from 
      sortedData = _.sortBy(data, function(item){
        return item[sort];
      });
 
      if(sortAscending === false){
        sortedData.reverse();
      }
      return {
        "currentPage": 0,
        "externalSortColumn": sort,
        "externalSortAscending": sortAscending,
        "pretendServerData": sortedData,
        "results": sortedData.slice(0,this.state.externalResultsPerPage)
      };
    },
    changeSort: function(sort, sortAscending){
      //this should change the sort for the given column
      this.setState(this.sortData(sort, sortAscending, this.state.pretendServerData));
    },
    setFilter: function(filter){
        //filtering should generally occur on the server (or wherever) 
        //this is a lot of code for what should normally just be a method that is used to pass data back and forth
        var sortedData = this.sortData(this.state.externalSortColumn, this.state.externalSortAscending, externalData);
 
        if(filter === ""){
            this.setState(_.extend(sortedData, {maxPages: Math.round(sortedData.pretendServerData.length > this.state.externalResultsPerPage ? sortedData.pretendServerData.length/this.state.externalResultsPerPage : 1)}));
 
            return;
        }
 
        var filteredData = _.filter(sortedData.pretendServerData,
            function(item) {
                var arr = _.values(item);
                for(var i = 0; i < arr.length; i++){
                   if ((arr[i]||"").toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0){
                    return true;
                   }
                }
 
                return false;
            });
 
        this.setState({
            pretendServerData: filteredData,
            maxPages: Math.round(filteredData.length > this.state.externalResultsPerPage ? filteredData.length/this.state.externalResultsPerPage : 1),
            "results": filteredData.slice(0,this.state.externalResultsPerPage)
        });
    },
    setPageSize: function(size){
        this.setState({
            currentPage: 0,
            externalResultsPerPage: size,
            maxPages: Math.round(this.state.pretendServerData.length > size ? this.state.pretendServerData.length/size : 1),
            results: this.state.pretendServerData.slice(0,size)
        });
    },
    render: function(){
      return <Griddle useExternal={true} externalSetPage={this.setPage}
        externalChangeSort={this.changeSort} externalSetFilter={this.setFilter}
        externalSetPageSize={this.setPageSize} externalMaxPage={this.state.maxPages}
        externalCurrentPage={this.state.currentPage} results={this.state.results} tableClassName="table" resultsPerPage={this.state.externalResultsPerPage}
        externalSortColumn={this.state.externalSortColumn} externalSortAscending={this.state.externalSortAscending} showFilter={true} showSettings={true} />
    }
});
 
React.render(<SimulatedExternalComponent />, document.getElementById("griddle-external-simulated"));
```

@@include('./externalData/external-simulated.html')

<hr />

####Griddle With Callback####

Previous versions of Griddle had a built-in callback for obtaining external data. This has since been moved into its own component to help simplify the main Griddle component. The call definition is the same. 

#####Important!#####

<strong>GriddleWithCallback is in its own GitHub repository and npm package. To install GriddleWithCallback `npm install griddle-callback` and anywhere where it is used, `require GriddleWithCallback = require('griddle-callback');`</strong>

#####Example:#####

Lets assume we want to obtain Star Wars data like in the example above except using GriddleWithCallback instead of using the exernal results properties. We will start out by creating a callback method. The Griddle callback has access to `filterString, sortColumn, sortAscending, page, pageSize, callback` parameters.

For the example, our Callback looks like this: 

```javascript
var loadData = function(filterString, sortColumn, sortAscending, page, pageSize, callback) {
	page+=1;

	swapiModule.getStarships(page, function(data){
		callback({
			results: data.results,
			totalResults: data.count,
			pageSize: pageSize
		});	
	});
};
```

@@include('./externalData/callback-swapi.html')