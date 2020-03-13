import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';

import {
  columnIdsSelector,
  rowDataSelector,
  rowPropertiesSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/localSelectors';
import { valueOrResult } from '../../../utils/valueUtils';

const ComposedRowContainer = (OriginalComponent) =>
  connect((state, props) => ({
    columnIds: columnIdsSelector(state),
    rowProperties: rowPropertiesSelector(state),
    rowData: rowDataSelector(state, props),
    className: classNamesForComponentSelector(state, 'Row'),
    style: stylesForComponentSelector(state, 'Row')
  }))((props) => {
    const { rowProperties, className, context, ...otherProps } = props;
    const rowContainerProps = {
      ...otherProps,
      Cell: context.components.Cell,
      className: valueOrResult(rowProperties.cssClassName, props) || props.className
    };
    return (
      <OriginalComponent
        griddleKey={rowContainerProps.griddleKey}
        columnIds={rowContainerProps.columnIds}
        Cell={rowContainerProps.Cell}
        className={rowContainerProps.className}
        style={rowContainerProps.style}
      />
    );
  });

export default ComposedRowContainer;
