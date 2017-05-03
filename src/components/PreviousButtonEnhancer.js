import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import { combineHandlers } from '../utils/compositionUtils';

const enhance = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  mapProps(({ events: { onPrevious }, ...props }) => ({
    ...props,
    onClick: combineHandlers([onPrevious, props.onClick]),
  }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
