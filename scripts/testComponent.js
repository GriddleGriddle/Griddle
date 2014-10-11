/** @jsx React.DOM */

//This whole file is pretty junky... just an example
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
            example = <Griddle results={fakeData} columnMetadata={columnMeta} tableClassName="table"/>
        } else if(this.props.subgrid == true){
            example = <Griddle results={fakeSubgridData} columnMetadata={columnMeta} tableClassName="table" />
        } else if (this.props.external == true) {
            example = <Griddle getExternalResults={fakeDataMethod} columnMetadata={columnMeta}  showFilter={true} tableClassName="table" />
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
            "currentPage": 0,
        }
    },
    pageChange: function(event){
        this.props.setPage(parseInt(event.target.getAttribute("data-value")));
    },
    render: function(){
        var previous = "";
        var next = "";

        if(this.props.currentPage > 0){
            previous = <span onClick={this.props.previous} className="previous"><i className="glyphicon glyphicon-arrow-left"></i>{this.props.previousText}</span>
        }

        if(this.props.currentPage != (this.props.maxPage -1)){
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
            options.push(<button className={selected} data-value={i} onClick={this.pageChange}>{i + 1}</button>);
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


React.renderComponent(
    <TestComponent />, document.getElementById('grid')
);

React.renderComponent(
    <Griddle results={emptyData} noDataMessage={"No data could be found."} />, document.getElementById('noDataMessage')
);

React.renderComponent(
    <Griddle results={emptyData} customNoData={CustomNoDataComponent} />, document.getElementById('customNoDataComponent')
);

React.renderComponent(
    <TestComponent simple={false} results={emptyData}/>, document.getElementById('examplegrid')
);

React.renderComponent(
    <TestComponent simple={false}/>, document.getElementById('moregrid')
);

React.renderComponent(
        <TestComponent simple={false} subgrid={true}/>, document.getElementById('subgrid')
);

React.renderComponent(
        <TestComponent simple={false} external={true}/>, document.getElementById('externaldata')
);

React.renderComponent(
    <Griddle results={fakeData} columnMetadata={columnMeta} customFormatClassName="row" useCustomFormat="true" showFilter="true" tableClassName="table" customFormat={OtherComponent} showSettings="true" allowToggleCustom="true" />, document.getElementById('customdata')
);
React.renderComponent(
    <Griddle results={fakeData} customFormatClassName="row" useCustomFormat="true" useCustomPager="true" showFilter="true" tableClassName="table" customFormat={OtherComponent} customPager={OtherPager} showSettings="true" allowToggleCustom="true" />, document.getElementById('customdatacustompager')
);

React.renderComponent(
    <Griddle results={propertiesItem} showFilter={true} tableClassName="table" resultsPerPage={100} columnMetadata={propertyGridMeta} />, document.getElementById('properties-grid')
);
