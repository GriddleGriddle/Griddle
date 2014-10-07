/** @jsx React.DOM */

var CustomNoDataComponent = React.createClass({
    getDefaultProps: function() {
        return { "message":"" };
    },
    render: function() {
        debugger;
        return (
        <div>we aint got no data!</div>);
    }
});

//This whole file is pretty junky... just an example
var TestComponent = React.createClass({
    getDefaultProps: function() {
        return{
            "simple": true,
            "subgrid": false,
            "external": false,
            "customNoData": {}
        };
	},	
	render: function(){
		var example = ""

		if (this.props.simple){
			example = <Griddle results={fakeData} tableClassName="table"/>
		} else if(this.props.subgrid == true){
			
		} else if (this.props.external == true) {
			
		} else { 
			example = <Griddle results={fakeData} tableClassName="table" 
						showFilter={true} showSettings={true} 
						columns={["name", "city", "state", "country"]}/>
						}
        debugger;
		if (this.props.customNoData != null)
		{
		    
		    example = <Griddle results={fakeData} customNoData={this.props.customNoData} tableClassName="table"/>
        }

		return (
			<div>{example}</div>
		);
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


//<TestComponent customNoData={CustomNoDataComponent} />, document.getElementById('grid')
React.renderComponent(
	<Griddle results={fakeData} customNoData={CustomNoDataComponent} />, document.getElementById('grid')
);

//React.renderComponent(
//	<TestComponent simple={false}/>, document.getElementById('examplegrid')
//);

//React.renderComponent(
//	<TestComponent simple={false}/>, document.getElementById('moregrid')
//);

//React.renderComponent(
//		<TestComponent simple={false} subgrid={true}/>, document.getElementById('subgrid')
//);

//React.renderComponent(
//		<TestComponent simple={false} external={true}/>, document.getElementById('externaldata')
//);

//React.renderComponent(
//	<Griddle results={fakeData} customFormatClassName="row" useCustomFormat="true" showFilter="true" tableClassName="table" customFormat={OtherComponent} showSettings="true" allowToggleCustom="true" />, document.getElementById('customdata')
//);

