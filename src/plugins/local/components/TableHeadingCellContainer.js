import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, mapProps } from 'recompose';
import { sortPropertyByIdSelector, iconByNameSelector } from '../../../selectors/dataSelectors';
import { setSortColumn } from '../../../actions';

function setSortProperties({setSortColumn, sortProperty, columnId}) {
  return function(event) {
    if (sortProperty === null) {
      setSortColumn({ id: columnId, sortAscending: true });
      return;
    }

    const newSortProperty = {
      ...sortProperty,
      sortAscending: !sortProperty.sortAscending
    };

    setSortColumn(newSortProperty);
  };
}

function getIcon({sortProperty, sortAscendingIcon, sortDescendingIcon}) {
  if (sortProperty) {
    return sortProperty.sortAscending ? sortAscendingIcon : sortDescendingIcon;
  }

  // return null so we don't render anything if no sortProperty
  return null;
}
const EnhancedHeadingCell = (OriginalComponent => compose(
  connect(
    (state, props) => ({
      sortProperty: sortPropertyByIdSelector(state, props),
      sortAscendingIcon: iconByNameSelector(state, { name: 'sortAscending'}),
      sortDescendingIcon: iconByNameSelector(state, { name: 'sortDescending'})
    }),
    {
      setSortColumn
    }
  ),
  withHandlers({
    onClick: setSortProperties
  }),
  //TODO: use with props on change or something more performant here
  mapProps(props => ({
    icon: getIcon(props),
    ...props
  }))
)((props) => (
  <OriginalComponent
    {...props}
    onClick={props.onClick} />
)));

export default EnhancedHeadingCell;