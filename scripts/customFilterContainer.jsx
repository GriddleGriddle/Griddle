/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');

var CustomFilterContainer = React.createClass({
  getDefaultProps: function(){
    return {
      "placeholderText": ""
    }
  },
  render: function(){
      var that = this;

      if (typeof that.props.customFilterComponent !== 'function'){
        console.log("Couldn't find valid template.");
        return (<div></div>);
      }

      return <that.props.customFilterComponent
        changeFilter={this.props.changeFilter}
        results={this.props.results}
        currentResults={this.props.currentResults}
        placeholderText={this.props.placeholderText} />;
  }
});

module.exports = CustomFilterContainer;
