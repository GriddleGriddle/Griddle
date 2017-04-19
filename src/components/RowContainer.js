import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import {
  columnIdsSelector,
  rowPropertiesSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector,
} from '../selectors/dataSelectors';

const ComposedRowContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
  }),
  connect((state, props) => ({
    columnIds: columnIdsSelector(state),
    rowProperties: rowPropertiesSelector(state),
    className: classNamesForComponentSelector(state, 'Row'),
    style: stylesForComponentSelector(state, 'Row'),
  })),
  mapProps(props => {
    const { components, rowProperties, className, ...otherProps } = props;
    return {
      Cell: components.Cell,
      className: (rowProperties.cssFunction && rowProperties.cssFunction(props.rowData, props.index)) || props.className,
      ...otherProps,
    };
  }),
)(props => (
  <OriginalComponent
    {...props}
  />
));

export default ComposedRowContainer;
