import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import { combineHandlers } from '../utils/compositionUtils';

const EnhancedHeadingCell = OriginalComponent => compose(
  getContext({
    events: PropTypes.object,
  }),
  mapProps(({ events: { onSort }, ...props }) => ({
    ...props,
    onClick: combineHandlers([() => onSort && onSort({ id: props.columnId }), props.onClick]),
  }))
)(props => <OriginalComponent {...props} />);

export default EnhancedHeadingCell;
