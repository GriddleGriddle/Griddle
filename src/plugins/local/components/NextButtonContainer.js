import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { hasNextSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/localSelectors';
import { getNext } from '../../../actions';

const enhance = OriginalComponent => connect(state =>
  createStructuredSelector({
    hasNext: hasNextSelector,
    className: classNamesForComponentSelector(state, 'NextButton'),
    style: stylesForComponentSelector(state, 'NextButton'),
  }),
  {
    getNext
  }
)(props => <OriginalComponent {...props} onClick={props.getNext} text="Next" />);

export default enhance;
