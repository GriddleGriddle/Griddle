import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import { getNext } from '../actions';
import { combineHandlers } from '../utils/compositionUtils';
import { connect } from '../utils/griddleConnect';

const enhance = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  connect(null, { getNext }),
  mapProps(({ events: { onNext }, ...props }) => ({
    ...props,
    onClick: combineHandlers([onNext, props.getNext, props.onClick]),
  }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
