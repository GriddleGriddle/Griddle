import React, { PropTypes } from 'react';
import { getContext, mapProps, compose } from 'recompose';

const EnhancedHeadingCell = OriginalComponent => compose(
  getContext({
    events: PropTypes.object,
  }),
  mapProps(({ events: { onSort }, ...props }) => ({
    ...props,
    onClick: (...args) => [props.onClick, () => onSort({ id: props.columnId })].forEach(func => func(args)),
  }))
)(props => <OriginalComponent {...props} />);

export default EnhancedHeadingCell;
