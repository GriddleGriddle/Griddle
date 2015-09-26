/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');

var GridNoData = React.createClass({
  getDefaultProps: function(){
    return {
      'noDataMessage': 'No Data'
    };
  },

  render: function(){
    return(
      <div>{this.props.noDataMessage}</div>
    );
  }
});

module.exports = GridNoData;
