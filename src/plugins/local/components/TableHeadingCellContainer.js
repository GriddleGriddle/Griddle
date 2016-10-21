import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, mapProps } from 'recompose';
import { sortPropertyByIdSelector } from '../../../selectors/dataSelectors';
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

const EnhancedHeadingCell = (OriginalComponent => compose(
  connect(
    (state, props) => ({
      sortProperty: sortPropertyByIdSelector(state, props)
    }),
    {
      setSortColumn
    }
  ),
  withHandlers({
    onClick: setSortProperties
  })
)((props) => (
  <OriginalComponent
    {...props}
    onClick={props.onClick} />
)));

export default EnhancedHeadingCell;