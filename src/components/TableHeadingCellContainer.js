import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';
import { setSortProperties } from '../utils/columnUtils';

const EnhancedHeadingCell = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  withHandlers({
    onClick: ({ events: { onSort }, columnId }) => event => {
      onSort({ id: columnId })
    }
  }),
)((props) => {
  return (
    <OriginalComponent {...props} />
  );
});

export default EnhancedHeadingCell;
