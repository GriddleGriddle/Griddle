import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ColumnDefinition extends Component {
  static PropTypes = {
    //The name of the column that this definition applies to.
    id: PropTypes.string.isRequired,

    //The order that this column appears in. If not specified will just use the order that they are defined
    order: PropTypes.number,

    //Determines whether or not the user can disable this column from the settings.
    locked: PropTypes.bool,

    //The css class name, or a function to generate a class name from props, to apply to the header for the column.
    headerCssClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    //The css class name, or a function to generate a class name from props, to apply to this column.
    cssClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    //The display name for the column. This is used when the name in the column heading and settings should be different from the data passed in to the Griddle component.
    title: PropTypes.string,

    //The component that should be rendered instead of the standard column data. This component will still be rendered inside of a TD element.
    customComponent: PropTypes.object,

    //The component that should be used instead of the normal title
    customHeadingComponent: PropTypes.object,

    //Can this column be sorted
    sortable: PropTypes.bool,

    //What sort type this column uses - magic string :shame:
    sortType: PropTypes.string,

    //Any extra data that should be passed to each instance of this column
    extraData: PropTypes.object,

    //The width of this column -- this is string so things like % can be specified
    width: PropTypes.string,

    //The number of cells this column should extend. Default is 1.
    colSpan: PropTypes.number,

    // Is this column visible
    visible: PropTypes.bool,

    // Is this column metadta
    isMetadata: PropTypes.bool,
  };

  render() {
    return null;
  }
}
