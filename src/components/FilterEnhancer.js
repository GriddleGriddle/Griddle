import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
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
