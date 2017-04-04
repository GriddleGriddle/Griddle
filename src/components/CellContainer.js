import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import getContext from 'recompose/getContext';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';

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
  if (!hasWidthOrStyles(cellProperties)) { return originalStyles; }

  let styles = originalStyles;

  // we want to take griddle style object styles, cell specific styles
  if (cellProperties.hasOwnProperty('style')) {
    styles = Object.assign({}, styles, originalStyles, cellProperties.style);
  }

  if (cellProperties.hasOwnProperty('width')) {
    styles = Object.assign({}, styles, { width: cellProperties.width });
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
      <props.customComponent {...props} /> :
      props.value
  })})
)(({ value, style, className }) => (
  <OriginalComponent
    value={value}
    style={style}
    className={className}
  />
))

export default ComposedCellContainer;
