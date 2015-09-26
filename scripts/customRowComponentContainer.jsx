/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');

var CustomRowComponentContainer = React.createClass({
  getDefaultProps: function(){
    return{
      'data': [],
      'metadataColumns': [],
      'className': '',
      'customComponent': {}
    };
  },
  render: function() {
    var that = this;

    if (typeof that.props.customComponent !== 'function'){
      //TODO: PropTypes
      throw 'Couldn\'t find valid template.';
    }

    var nodes = this.props.data.map(function(row, index){
      return <that.props.customComponent data={row} metadataColumns={that.props.metadataColumns} key={index} />;
    });

    return (
      <div className={this.props.className} style={this.props.style}>
        {nodes}
      </div>
    );
  }
});

module.exports = CustomRowComponentContainer;
