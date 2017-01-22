import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';
import { hasPreviousSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  connect((state, props) => ({
    hasPrevious: hasPreviousSelector(state, props),
  })),
  mapProps(({ events: { onPrevious }, ...props }) => ({
    onClick: onPrevious,
    // TODO: Get this from the store
    text: 'Previous',
    ...props }))
)((props) => <OriginalComponent {...props} />);

export default enhance;

