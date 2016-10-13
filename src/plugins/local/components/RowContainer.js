import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';
import { columnIdsSelector } from '../selectors/localSelectors';

const ComposedRowContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  connect((state) => ({
    columnIds: columnIdsSelector(state)
  })),
  mapProps(props => ({
    Cell: props.components.Cell,
    ...props
  })),
)(({Cell, columnIds, griddleKey}) => (
  <OriginalComponent
    griddleKey={griddleKey}
    columnIds={columnIds}
    Cell={Cell}
  />
));

export default ComposedRowContainer;