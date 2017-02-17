import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';
import { hasNextSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => connect((state, props) => ({
  text: 'Next', // TODO: Get this from the store
  hasNext: hasNextSelector(state, props),
  className: classNamesForComponentSelector(state, 'NextButton'),
  style: stylesForComponentSelector(state, 'NextButton'),
}))((props) => <OriginalComponent {...props} />);

export default enhance;
