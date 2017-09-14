import React from 'react';
import PropTypes from 'prop-types';
import getContext from 'recompose/getContext';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';

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
