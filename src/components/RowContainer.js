import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';

const ComposedRowContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object,
  }),
  connect((state, props) => {
    const { columnIdsSelector } = props.selectors;
    return {
      columnIds: columnIdsSelector(state),
    };
  }),
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
