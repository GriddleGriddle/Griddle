import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';
import { hasNextSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  connect((state, props) => ({
    hasNext: hasNextSelector(state, props),
    className: classNamesForComponentSelector(state, 'NextButton'),
    style: stylesForComponentSelector(state, 'NextButton'),
  })),
  mapProps(({ events: { onNext }, ...props }) => ({
    onClick: onNext,
    text: 'Next', // TODO: Get this from the store
    ...props }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
