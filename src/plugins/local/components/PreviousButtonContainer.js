import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { hasPreviousSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/localSelectors';
import { getPrevious } from '../../../actions';

const enhance = OriginalComponent => connect(state =>
  createStructuredSelector({
    hasPrevious: hasPreviousSelector,
    className: classNamesForComponentSelector(state, 'PreviousButton'),
    style: stylesForComponentSelector(state, 'PreviousButton'),
  }),
  {
    getPrevious
  }
)(props => <OriginalComponent {...props} onClick={props.getPrevious} text="Previous" />);

export default enhance;
