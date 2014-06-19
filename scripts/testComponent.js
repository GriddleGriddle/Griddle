/** @jsx React.DOM */

var TestComponent = React.createClass({
	render: function(){
		return (
			<Griddle results= {fakeData} resultsPerPage={7} columns={['name', 'company', 'city', 'state', 'country']} gridClassName="table"/>
		);
	}
});


React.renderComponent(
	<TestComponent />, document.getElementById('grid')
);
