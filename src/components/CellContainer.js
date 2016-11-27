import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';

const ComposedCellContainer = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object,
  }),
  connect((state, props) => {
    const { customComponentSelector, cellValueSelector } = props.selectors;
    return {
      value: cellValueSelector(state, props),
      customComponent: customComponentSelector(state, props),
    };
  }),
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
