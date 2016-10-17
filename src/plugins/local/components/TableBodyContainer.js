import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';

import { visibleRowIdsSelector } from '../selectors/localSelectors';

const ComposedTableBodyContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  connect((state) => ({
    visibleRowIds: visibleRowIdsSelector(state)
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