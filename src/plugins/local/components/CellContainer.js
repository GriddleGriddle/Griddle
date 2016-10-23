import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';

import { cellValueSelector } from '../selectors/localSelectors';
import { customComponentSelector } from '../../../selectors/dataSelectors';

const ComposedCellContainer = OriginalComponent => compose(
  connect((state, props) => ({
    value: cellValueSelector(state, props),
    customComponent: customComponentSelector(state, props),
  })),
  mapProps(props => {
    return ({
    ...props,
    value: props.customComponent ?
      <props.customComponent
        value={props.value}
        griddleKey={props.griddleKey}
      /> :
      props.value
  })})
)(({value}) => (
  <OriginalComponent
    value={value}
  /> 
))

export default ComposedCellContainer;