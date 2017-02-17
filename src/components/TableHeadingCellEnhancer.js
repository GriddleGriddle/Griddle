import React, { PropTypes } from 'react';
import { getContext, mapProps, compose } from 'recompose';
import { combineHandlers } from '../utils/compositionUtils';

const EnhancedHeadingCell = OriginalComponent => compose(
  getContext({
    events: PropTypes.object,
  }),
  mapProps(({ events: { onSort }, ...props }) => ({
    ...props,
    onClick: combineHandlers([() => onSort({ id: props.columnId }), props.onClick]),
  }))
)(props => <OriginalComponent {...props} />);

export default EnhancedHeadingCell;
