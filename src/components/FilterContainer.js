import React, { PropTypes } from 'react';
import { withHandlers, getContext, compose, mapProps } from 'recompose';

const EnhancedFilter = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  mapProps(props => ({
    setFilter: props.events.onFilter
  }))
)(({setFilter}) => <OriginalComponent setFilter={setFilter} />);

export default EnhancedFilter;
