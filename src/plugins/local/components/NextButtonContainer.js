import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { hasNextSelector } from '../selectors/localSelectors';
import { getNext } from '../../../actions';

const enhance = OriginalComponent => connect(
  createStructuredSelector({
    hasNext: hasNextSelector,
  }),
  {
    getNext
  }
)(props => <OriginalComponent {...props} onClick={props.getNext} text="Next" />);

export default enhance;
