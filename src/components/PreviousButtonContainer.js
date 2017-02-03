import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';
import { hasPreviousSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  connect((state, props) => ({
    hasPrevious: hasPreviousSelector(state, props),
    className: classNamesForComponentSelector(state, 'PreviousButton'),
    style: stylesForComponentSelector(state, 'PreviousButton'),
  })),
  mapProps(({ events: { onPrevious }, ...props }) => ({
    onClick: onPrevious,
    text: 'Previous', // TODO: Get this from the store
    ...props }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
