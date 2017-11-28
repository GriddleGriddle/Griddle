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
  mapProps(({ events: { onGetPage }, ...props }) => ({
    ...props,
    setPage: combineHandlers([onGetPage, props.setPage]),
  }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
