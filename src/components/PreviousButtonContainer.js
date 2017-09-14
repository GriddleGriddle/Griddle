import React from 'react';
import { connect } from '../utils/griddleConnect';
import { textSelector, hasPreviousSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => connect((state, props) => ({
  text: textSelector(state, { key: 'previous' }),
  hasPrevious: hasPreviousSelector(state, props),
  className: classNamesForComponentSelector(state, 'PreviousButton'),
  style: stylesForComponentSelector(state, 'PreviousButton'),
}))((props) => <OriginalComponent {...props} />);

export default enhance;
