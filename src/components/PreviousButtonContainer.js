import React from 'react';
import { connect } from 'react-redux';
import { hasPreviousSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => connect((state, props) => ({
  text: 'Previous', // TODO: Get this from the store
  hasPrevious: hasPreviousSelector(state, props),
  className: classNamesForComponentSelector(state, 'PreviousButton'),
  style: stylesForComponentSelector(state, 'PreviousButton'),
}))((props) => <OriginalComponent {...props} />);

export default enhance;
