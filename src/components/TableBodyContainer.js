import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';

import { visibleRowIdsSelector } from '../selectors/dataSelectors';

const ComposedTableBodyContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object,
  }),
  connect((state, props) => ({
      visibleRowIds: visibleRowIdsSelector(state),
  })),
  mapProps(props => ({
    Row:  props.components.Row,
    ...props
  })),
  // withHandlers({
  //   Row: props => props.components.Row
  // })
)(({Row, visibleRowIds}) => (
  <OriginalComponent
    rowIds={visibleRowIds}
    Row={Row}
  />
));

export default ComposedTableBodyContainer;
