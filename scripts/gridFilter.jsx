/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');

var GridFilter = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        placeholderText: React.PropTypes.string,
    },

    getDefaultProps: function(){
      return {
        className: 'row filter-container',
        placeholderText: '',
      }
    },
    handleChange: function(event){
        this.props.changeFilter(event.target.value);
    },
    render: function(){
        return (
            <div className={this.props.className}>
                <input
                    type="text"
                    name="filter"
                    placeholder={this.props.placeholderText}
                    className="form-control"
                    onChange={this.handleChange} />
            </div>
        );
    }
});

module.exports = GridFilter;
