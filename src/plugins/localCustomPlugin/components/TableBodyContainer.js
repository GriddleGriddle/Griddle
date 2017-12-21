import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/localSelectors';

const ComposedTableBodyContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object,
  }),
  mapProps(props => ({
    Row: props.components.Row,
    visibleRowIdsSelector: props.selectors.visibleRowIdsSelector,
    ...props
  })),
  connect((state, props) => ({
    visibleRowIds: props.visibleRowIdsSelector(state),
    className: classNamesForComponentSelector(state, 'TableBody'),
    style: stylesForComponentSelector(state, 'TableBody'),
    extTrigger: ((state)=>{return state.get('extTrigger')})(state),
  })),
  // withHandlers({
  //   Row: props => props.components.Row
  // })
)(({ Row, visibleRowIds, style, className, extTrigger }) => (
  <OriginalComponent
    rowIds={visibleRowIds}
    Row={Row}
    style={style}
    className={className}
    extTrigger={extTrigger}
  />
));

export default ComposedTableBodyContainer;
