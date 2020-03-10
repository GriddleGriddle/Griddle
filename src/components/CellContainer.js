import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  customComponentSelector,
  cellValueSelector,
  cellPropertiesSelectorFactory,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import { valueOrResult } from '../utils/valueUtils';

function hasWidthOrStyles(cellProperties) {
  return cellProperties.hasOwnProperty('width') || cellProperties.hasOwnProperty('styles');
}

function getCellStyles(cellProperties, originalStyles) {
  if (!hasWidthOrStyles(cellProperties)) {
    return originalStyles;
  }

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

const mapStateToProps = () => {
  const cellPropertiesSelector = cellPropertiesSelectorFactory();
  return (state, props) => {
    return {
      value: cellValueSelector(state, props),
      customComponent: customComponentSelector(state, props),
      cellProperties: cellPropertiesSelector(state, props),
      className: classNamesForComponentSelector(state, 'Cell'),
      style: stylesForComponentSelector(state, 'Cell')
    };
  };
};

const ComposedCellContainer = (OriginalComponent) =>
  connect(mapStateToProps)((props) => {
    const cellContainerProps = {
      ...props.cellProperties.extraData,
      ...props,
      className: valueOrResult(props.cellProperties.cssClassName, props) || props.className,
      style: getCellStyles(props.cellProperties, props.style),
      value: props.customComponent ? (
        <props.customComponent {...props.cellProperties.extraData} {...props} />
      ) : (
        props.value
      )
    };
    return <OriginalComponent {...cellContainerProps} />;
  });

export default ComposedCellContainer;
