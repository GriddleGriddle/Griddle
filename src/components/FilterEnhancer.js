import React, { PropTypes } from 'react';
import { getContext, compose, mapProps } from 'recompose';
import { combineHandlers } from '../utils/compositionUtils';

const EnhancedFilter = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  mapProps(({ events: { onFilter }, ...props }) => ({
    ...props,
    setFilter: combineHandlers([onFilter, props.setFilter]),
  }))
)(props => <OriginalComponent {...props} />);

export default EnhancedFilter;
