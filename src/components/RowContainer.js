import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { connect } from '../utils/griddleConnect';
import { valueOrResult } from '../utils/valueUtils';

const ComposedRowContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object
  }),
  connect(
    (state, props) => ({
      columnIds: props.selectors.columnIdsSelector(state),
      rowProperties: props.selectors.rowPropertiesSelector(state),
      rowData: props.selectors.rowDataSelector(state, props),
      className: props.selectors.classNamesForComponentSelector(state, 'Row'),
      style: props.selectors.stylesForComponentSelector(state, 'Row'),
    })
  ),
  mapProps(props => {
    const { components, rowProperties, className, ...otherProps } = props;
    return {
      Cell: components.Cell,
      className: valueOrResult(rowProperties.cssClassName, props) || props.className,
      ...otherProps,
    };
  }),
)(props => (
  <OriginalComponent
  {...props}
  />
));

export default ComposedRowContainer;
