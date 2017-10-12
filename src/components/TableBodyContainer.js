import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { connect } from '../utils/griddleConnect';

const ComposedTableBodyContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object,
  }),
  connect(
    (state, props) => ({
      visibleRowIds: props.selectors.visibleRowIdsSelector(state),
      className: props.selectors.classNamesForComponentSelector(state, 'TableBody'),
      style: props.selectors.stylesForComponentSelector(state, 'TableBody'),
    })
  ),
  mapProps(props => {
    const { components, selectors, ...otherProps } = props;
    return {
      Row:  props.components.Row,
      ...otherProps,
    };
  }),
)(({Row, visibleRowIds, style, className}) => (
  <OriginalComponent
  rowIds={visibleRowIds}
  Row={Row}
  style={style}
  className={className}
  />
));

export default ComposedTableBodyContainer;
