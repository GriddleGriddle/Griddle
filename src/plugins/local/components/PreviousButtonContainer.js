import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { hasPreviousSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/localSelectors';
import { getPrevious } from '../../../actions';

const enhance = OriginalComponent => connect(state => ({
  hasPrevious: hasPreviousSelector(state),
  className: classNamesForComponentSelector(state, 'PreviousButton'),
  style: stylesForComponentSelector(state, 'PreviousButton'),
}),
  {
    getPrevious
  }
)(props => <OriginalComponent {...props} onClick={props.getPrevious} text="Previous" />);

export default enhance;
