import React, { PropTypes } from 'react';
import { getContext, compose, mapProps } from 'recompose';

const EnhancedFilter = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  mapProps(({ events: { onFilter }, ...props }) => ({
    ...props,
    setFilter: (...args) => [onFilter, props.setFilter].forEach(func => !!func && func(args)),
  }))
)(props => <OriginalComponent {...props} />);

export default EnhancedFilter;
