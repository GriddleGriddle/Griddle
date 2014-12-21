/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var ChartistGraph = require('react-chartist'); 

var TestChart = React.createClass({
	getInitialProps: function(){

	},
	render: function(){
		var simpleLineChartData = {
			  labels: _.keys(this.props.data[0]),
			  series: []
		};

		_.each(this.props.data, function(item){
			simpleLineChartData.series.push(_.values(item));
		});
		return <ChartistGraph data={simpleLineChartData} type={'Line'} />	
	}
});

module.exports = TestChart;
