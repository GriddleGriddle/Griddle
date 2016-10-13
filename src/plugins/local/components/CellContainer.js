import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';

import { cellValueSelector } from '../selectors/localSelectors';

const ComposedCellContainer = OriginalComponent => compose(
  connect((state, props) => ({
    value: cellValueSelector(state, props)
  }))
)(({value}) => (
  <td>{value}</td>
))

export default ComposedCellContainer;