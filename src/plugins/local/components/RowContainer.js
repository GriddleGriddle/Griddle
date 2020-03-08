import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

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
  compose(
    connect((state, props) => ({
      columnIds: columnIdsSelector(state),
      rowProperties: rowPropertiesSelector(state),
      rowData: rowDataSelector(state, props),
      className: classNamesForComponentSelector(state, 'Row'),
      style: stylesForComponentSelector(state, 'Row')
    })),
    mapProps((props) => {
      const griddleContext = useContext(GriddleContext);
      const { rowProperties, className, ...otherProps } = props;
      return {
        Cell: griddleContext.components.Cell,
        className: valueOrResult(rowProperties.cssClassName, props) || props.className,
        ...otherProps
      };
    })
  )(({ Cell, columnIds, griddleKey, style, className }) => (
    <OriginalComponent
      griddleKey={griddleKey}
      columnIds={columnIds}
      Cell={Cell}
      className={className}
      style={style}
    />
  ));

export default ComposedRowContainer;
