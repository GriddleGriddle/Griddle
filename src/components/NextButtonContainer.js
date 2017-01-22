import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';
import { hasNextSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  connect((state, props) => ({
    hasNext: hasNextSelector(state, props),
  })),
  mapProps(({ events: { onNext }, ...props }) => ({
    onClick: onNext,
    // TODO: Get this from the store
    text: 'Next',
    ...props }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
