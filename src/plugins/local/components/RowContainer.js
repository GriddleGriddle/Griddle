import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import {
  columnIdsSelector,
  rowDataSelector,
  rowPropertiesSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector,
} from '../selectors/localSelectors';

const ComposedRowContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  connect((state, props) => ({
    columnIds: columnIdsSelector(state),
    rowProperties: rowPropertiesSelector(state),
    rowData: rowDataSelector(state, props),
    className: classNamesForComponentSelector(state, 'Row'),
    style: stylesForComponentSelector(state, 'Row'),
  })),
  mapProps((props) => {
    const { components, rowProperties, className, ...otherProps } = props;
    return {
      Cell: components.Cell,
      className: (rowProperties.cssFunction && rowProperties.cssFunction(props.rowData, props.index)) || props.className,
      ...otherProps,
    };
  }),
)(({Cell, columnIds, griddleKey, style, className }) => (
  <OriginalComponent
    griddleKey={griddleKey}
    columnIds={columnIds}
    Cell={Cell}
    className={className}
    style={style}
  />
));

export default ComposedRowContainer;