import React, { Component } from 'react';

export default class RowDefinition extends Component {
  static propTypes = {
    //Children can be either a single column definition or an array
    //of column definition objects
    //TODO: get this prop type working again
    /*children: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(ColumnDefinition),
      React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColumnDefinition))
    ]),*/
    //The column value that should be used as the key for the row
    //if this is not set it will make one up (not efficient)
    rowKey: React.PropTypes.string,

    //The column that will be known used to track child data
    //By default this will be "children"
    childColumnName: React.PropTypes.string,

    //The css class name, or a function to generate a class name from props, to apply to this row.
    cssClassName: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
  }

  render () {
    return null;
  }
}
