import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { visibleRowIdsSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const ComposedTableBodyContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object,
  }),
  connect((state, props) => ({
    visibleRowIds: visibleRowIdsSelector(state),
    className: classNamesForComponentSelector(state, 'TableBody'),
    style: stylesForComponentSelector(state, 'TableBody'),
  })),
  mapProps(props => {
    const { components, ...otherProps } = props;
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
