import React, { useContext } from 'react';
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
import GriddleContext from '../../../context/GriddleContext';

const ComposedRowContainer = (OriginalComponent) =>
  connect((state, props) => ({
    columnIds: columnIdsSelector(state),
    rowProperties: rowPropertiesSelector(state),
    rowData: rowDataSelector(state, props),
    className: classNamesForComponentSelector(state, 'Row'),
    style: stylesForComponentSelector(state, 'Row')
  }))((props) => {
    const griddleContext = useContext(GriddleContext);
    const { rowProperties, className, ...otherProps } = props;
    const rowContainerProps = {
      Cell: griddleContext.components.Cell,
      className: valueOrResult(rowProperties.cssClassName, props) || props.className,
      ...otherProps
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
