import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { hasPreviousSelector } from '../selectors/localSelectors';
import { getPrevious } from '../../../actions';

const enhance = OriginalComponent => connect(
  createStructuredSelector({
    hasPrevious: hasPreviousSelector,
  }),
  {
    getPrevious
  }
)(props => <OriginalComponent {...props} onClick={props.getPrevious} text="Previous" />);

export default enhance;
