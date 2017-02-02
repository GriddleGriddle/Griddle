import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';
import {
  customComponentSelector,
  cellValueSelector,
  cellPropertiesSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';

function hasWidthOrStyles(cellProperties) {
  return cellProperties.hasOwnProperty('width') || cellProperties.hasOwnProperty('styles');
}

function getCellStyles(cellProperties, originalStyles) {
  if (!hasWidthOrStyles(cellProperties)) { return null; }

  let styles = {};

  // we want to take griddle style object styles, cell specific styles
  if (cellProperties.hasOwnProperty('styles')) {
    styles = Object.assign(styles, originalStyles, cellProperties.styles);
  }

  if (cellProperties.hasOwnProperty('width')) {
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
      className: classNamesForComponentSelector(state, 'Cell'),
      style: stylesForComponentSelector(state, 'Cell'),
    };
  }),
  mapProps(props => {
    return ({
    ...props,
    style: getCellStyles(props.cellProperties, props.style),
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
