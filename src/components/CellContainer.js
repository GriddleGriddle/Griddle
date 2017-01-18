import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';
import { customComponentSelector, cellValueSelector, cellPropertiesSelector } from '../selectors/dataSelectors';

function hasWidthOrStyles(cellProperties) {
  return cellProperties.hasOwnProperty('width') || cellProperties.hasOwnProperty('styles');
}

function getCellStyles(cellProperties) {
  if(!hasWidthOrStyles(cellProperties)) { return null; }

  let styles = {};

  if (cellProperties.hasOwnProperty('styles')) {
    styles = Object.assign(styles, cellProperties.styles);
  }

  if(cellProperties.hasOwnProperty('width')) {
    styles = Object.assign(styles, { width: cellProperties.width });
  }

  return styles;
}

const ComposedCellContainer = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object,
  }),
  connect((state, props) => {
    return {
      value: cellValueSelector(state, props),
      customComponent: customComponentSelector(state, props),
      cellProperties: cellPropertiesSelector(state, props),
    };
  }),
  mapProps(props => {
    return ({
    ...props,
    style: getCellStyles(props.cellProperties),
    value: props.customComponent ?
      <props.customComponent
        value={props.value}
        griddleKey={props.griddleKey}
      /> :
      props.value
  })})
)(({value, style}) => (
  <OriginalComponent
    value={value}
    style={style}
  />
))

export default ComposedCellContainer;
