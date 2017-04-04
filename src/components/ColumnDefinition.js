import React, { PropTypes, Component } from 'react';

export default class ColumnDefinition extends Component {
  static PropTypes = {
    //The name of the column that this definition applies to.
    id: React.PropTypes.string.isRequired,

    //The order that this column appears in. If not specified will just use the order that they are defined
    order: React.PropTypes.number,

    //Determines whether or not the user can disable this column from the settings.
    locked: React.PropTypes.bool,

    //The css class name to apply to the header for the column
    headerCssClassName: React.PropTypes.string,

    //The css class name to apply to this column.
    cssClassName: React.PropTypes.string,

    //The display name for the column. This is used when the name in the column heading and settings should be different from the data passed in to the Griddle component.
    title: React.PropTypes.string,

    //The component that should be rendered instead of the standard column data. This component will still be rendered inside of a TD element.
    customComponent: React.PropTypes.object,

    //The component that should be used instead of the normal title
    customHeadingComponent: React.PropTypes.object,

    //Can this column be sorted
    sortable: React.PropTypes.bool,

    //What sort type this column uses - magic string :shame:
    sortType: React.PropTypes.string,

    //Any extra data that should be passed to each instance of this column
    extraData: React.PropTypes.object,

    //The width of this column -- this is string so things like % can be specified
    width: React.PropTypes.string,

    //The number of cells this column should extend. Default is 1.
    colSpan: React.PropTypes.number,

    // Is this column visible
    visible: React.PropTypes.bool,

    // Is this column metadta
    isMetadata: React.PropTypes.bool,
  };

  render() {
    return null;
  }
}
