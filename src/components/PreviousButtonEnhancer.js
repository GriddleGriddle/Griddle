import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import { getPrevious } from '../actions';
import { combineHandlers } from '../utils/compositionUtils';
import { connect } from '../utils/griddleConnect';

const enhance = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  connect(null, { getPrevious }),
  mapProps(({ events: { onPrevious }, ...props }) => ({
    ...props,
    onClick: combineHandlers([onPrevious, props.getPrevious, props.onClick]),
  }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
