/** @jsx React.DOM */

//This whole file is pretty junky... just an example

var BoldFormatter = React.createClass({
    render: function(){
        return <strong>{this.props.data}</strong>
    }
});

var externalData = fakeData.slice(0, 53);

//This whole thing is throw-away code.
//It's basically to show that you can wrap up griddle
//and give external data to it from another source (api / localstorage / etc)
var ExternalFormatter = React.createClass({

    getInitialState: function(){
      var initial = { "results": [],
          "currentPage": 0,
          "maxPages": 0,
          "pageSize": 6,
          "externalSortColumn":null,
          "externalSortAscending":true,
          "pretendServerData": externalData
      };

      return initial;
    },
    componentWillMount: function(){
        this.setState({
            maxPages: Math.round(this.state.pretendServerData.length/this.state.pageSize),
            "results": this.state.pretendServerData.slice(0,this.state.pageSize)
        })
    },
    setPage: function(index){
      //This should interact with the data source to get the page at the given index
      var number = index === 0 ? 0 : index * this.state.pageSize;
      this.setState(
        {
          "results": this.state.pretendServerData.slice(number, number+5>this.state.pretendServerData.length ? this.state.pretendServerData.length : number+this.state.pageSize),
          "currentPage": index
        });
    },
    sortData: function(sort, sortAscending, data){
      //throw away method to do the sorting so that other functions can access
      //this should all happen on the server so please don't base anything off this code
      //it's purely to show that you can wrap Griddle and control what page it shows as and all that
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
        "results": sortedData.slice(0,this.state.pageSize)
      };
    },
    changeSort: function(sort, sortAscending){
      //this should change the sort for the given column
      this.setState(this.sortData(sort, sortAscending, this.state.pretendServerData));
    },
    setFilter: function(filter){
        /*
          like everything else -- this is pretend code used to simulate something that we would do on the
          server-side (aka we would generally post the filter as well as other information used to populate
          the grid) and send back to the view (which would handle passing the data back to Griddle)
        */

        var sortedData = this.sortData(this.state.externalSortColumn, this.state.externalSortAscending, externalData);

        if(filter === ""){
            this.setState(_.extend(sortedData, {maxPages: Math.round(sortedData.pretendServerData.length > this.state.pageSize ? sortedData.pretendServerData.length/this.state.pageSize : 1)}));

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
            maxPages: Math.round(filteredData.length > this.state.pageSize ? filteredData.length/this.state.pageSize : 1),
            "results": filteredData.slice(0,this.state.pageSize)
        });
    },
    setPageSize: function(size){
    },
    render: function(){
      return <Griddle useExternal={true} externalSetPage={this.setPage}
        externalChangeSort={this.changeSort} externalSetFilter={this.setFilter}
        externalSetPageSize={this.setPageSize} externalMaxPages={this.state.maxPages}
        externalCurrentPage={this.state.currentPage} externalResults={this.state.results} tableClassName="table"
        externalSortColumn={this.state.externalSortColumn} externalSortAscending={this.state.externalSortAscending} showFilter={true} />
    }
});

var columnMeta = [
  {
    "columnName": "id",
    "order": 1,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "name",
    "order": 2,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "city",
    "order": 3,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "state",
    "order": 4,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "country",
    "order": 5,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "company",
    "order": 6,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "favoriteNumber",
    "order":  7,
    "locked": false,
    "visible": true
  }
];

var TestComponent = React.createClass({
    getDefaultProps: function() {
        return{
            "simple": true,
            "subgrid": false,
            "external": false
        };
    },
    render: function(){
        var example = ""

        if (this.props.simple){
            example = <Griddle results={fakeData} columnMetadata={columnMeta} resultsPerPage={10} infiniteScroll={true} bodyHeight={100} rowHeight={30} tableClassName="table"/>
        } else if(this.props.subgrid === true){
            example = <Griddle results={fakeSubgridData} columnMetadata={columnMeta} tableClassName="table" />
        } else if (this.props.external === true) {
            example = <ExternalFormatter />
        } else {
            example = <Griddle results={fakeData} columnMetadata={columnMeta} tableClassName="table"
            showFilter={true} showSettings={true}
            columns={["name", "city", "state", "country"]}/>
        }

        return (
			<div>{example}</div>
		);
    }
});

var CustomNoDataComponent = React.createClass({
    render: function() {
        return (
        <div>This is a custom component showing that there is no data to be displayed.</div>);
    }
});

var OtherComponent = React.createClass({
    getDefaultProps: function(){
        return { "data": {} };
    },
    render: function(){
        return (<div className="col-md-4">
        	<div className="panel panel-default custom-component">
		        	<div className="row">
			        	<div className="col-md-6"><h4>{this.props.data.name}</h4></div>
			        	<div className="col-md-6"><small>{this.props.data.company}</small></div>
		        	</div>
		        	<div>{this.props.data.city}</div>
		        	<div>{this.props.data.state}, {this.props.data.country}</div>
	        	</div>
        	</div>);
    }
});

var OtherPager = React.createClass({
    getDefaultProps: function(){
        return{
            "maxPage": 0,
            "nextText": "",
            "previousText": "",
            "currentPage": 0
        }
    },
    pageChange: function(event){
        this.props.setPage(parseInt(event.target.getAttribute("data-value"), 10));
    },
    render: function(){
        var previous = "";
        var next = "";

        if(this.props.currentPage > 0){
            previous = <span onClick={this.props.previous} className="previous"><i className="glyphicon glyphicon-arrow-left"></i>{this.props.previousText}</span>
        }

        if(this.props.currentPage !== (this.props.maxPage -1)){
            next = <span onClick={this.props.next} className="next">{this.props.nextText}<i className="glyphicon glyphicon-arrow-right"></i></span>
        }

        var options = [];

    	var startIndex = Math.max(this.props.currentPage - 5, 0);
    	var endIndex = Math.min(startIndex + 11, this.props.maxPage);

    	if (this.props.maxPage >= 11 && (endIndex - startIndex) <= 10) {
    		startIndex = endIndex - 11;
    	}

        for(var i = startIndex; i < endIndex ; i++){
        	var selected = this.props.currentPage == i ? "current-page-selected" : "";
            options.push(<button className={selected} data-value={i} onClick={this.pageChange} key={i}>{i + 1}</button>);
        }

        return (
            <div className="row custom-pager">
                <div className="col-xs-4">{previous}</div>
                <div className="col-xs-4 center pages">
                    {options}
                </div>
                <div className="col-xs-4 right">{next}</div>
            </div>
        )
    }
});


React.render(
    <TestComponent />, document.getElementById('grid')
);

React.render(
    <Griddle results={emptyData} showFilter={true} noDataMessage={"No data could be found."} />, document.getElementById('noDataMessage')
);

React.render(
    <Griddle results={emptyData} customNoData={CustomNoDataComponent} />, document.getElementById('customNoDataComponent')
);

React.render(
    <TestComponent simple={false} results={emptyData}/>, document.getElementById('examplegrid')
);

React.render(
    <TestComponent simple={false}/>, document.getElementById('moregrid')
);

React.render(
        <TestComponent simple={false} subgrid={true}/>, document.getElementById('subgrid')
);

React.render(
        <TestComponent simple={false} external={true}/>, document.getElementById('externaldata')
);

React.render(
    <Griddle results={fakeData} columnMetadata={columnMeta} customFormatClassName="row" useCustomFormat="true" showFilter="true" tableClassName="table" customFormat={OtherComponent} showSettings="true" allowToggleCustom="true" />, document.getElementById('customdata')
);
React.render(
    <Griddle results={fakeData} customFormatClassName="row" useCustomFormat="true" useCustomPager="true" showFilter="true" tableClassName="table" customFormat={OtherComponent} customPager={OtherPager} showSettings="true" allowToggleCustom="true" />, document.getElementById('customdatacustompager')
);

React.render(
    <Griddle results={propertiesItem} showFilter={true} tableClassName="table" resultsPerPage={100} columnMetadata={propertyGridMeta} />, document.getElementById('properties-grid')
);
