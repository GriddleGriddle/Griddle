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
  handleChange: function(event){
      this.props.changeFilter(event.target.value);
  },
  render: function(){
      var that = this;

      if (typeof that.props.customFilterComponent !== 'function'){
        console.log("Couldn't find valid template.");
        return (<div></div>);
      }

      return <that.props.customFilterComponent
        placeholderText={this.props.placeholderText} />;
  }
});

module.exports = CustomFilterContainer;
