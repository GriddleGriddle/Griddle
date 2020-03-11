import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  columnIdsSelector,
  rowDataSelector,
  rowPropertiesSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import { valueOrResult } from '../utils/valueUtils';

const ComposedRowContainer = (OriginalComponent) =>
  connect((state, props) => ({
    columnIds: columnIdsSelector(state),
    rowProperties: rowPropertiesSelector(state),
    rowData: rowDataSelector(state, props),
    className: classNamesForComponentSelector(state, 'Row'),
    style: stylesForComponentSelector(state, 'Row')
  }))((props) => {
    const { rowProperties, className, context, ...otherProps } = props;
    const rowProps = {
      Cell: context.components.Cell,
      className: valueOrResult(rowProperties.cssClassName, props) || props.className,
      ...otherProps
    };
    return <OriginalComponent {...rowProps} />;
  });

export default ComposedRowContainer;
