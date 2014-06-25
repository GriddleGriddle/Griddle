/** @jsx React.DOM */

//This whole file is pretty junky... just an example
var TestComponent = React.createClass({
    getDefaultProps: function() {
        return{
            "simple": true,
            "subgrid": false
		};
	},	
	render: function(){
		var example = ""

		if (this.props.simple){
			example = <Griddle results={fakeData} gridClassName="table"/>
		} else if(this.props.subgrid == true){
			example = <Griddle results={fakeSubgridData} gridClassName="table" />
		}else { 
			example = <Griddle results={fakeData} gridClassName="table" 
						showFilter={true} showSettings={true} 
						columns={["name", "city", "state", "country"]}/>
		}

		return (
			<div>{example}</div>
		);
	}
});


React.renderComponent(
	<TestComponent />, document.getElementById('grid')
);

React.renderComponent(
	<TestComponent simple={false}/>, document.getElementById('examplegrid')
);

React.renderComponent(
	<TestComponent simple={false}/>, document.getElementById('moregrid')
);

React.renderComponent(
		<TestComponent simple={false} subgrid={true}/>, document.getElementById('subgrid')
);

