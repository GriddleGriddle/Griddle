import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';
import { createStructuredSelector } from 'reselect';

import { hasNextSelector, hasPreviousSelector } from '../selectors/localSelectors';
import { getNext, getPrevious } from '../actions';

const EnhancedPaginationContainer = OriginalComponent => connect(
    createStructuredSelector({
      hasNext: hasNextSelector,
      hasPrevious: hasPreviousSelector
    }),
    {
      getNext,
      getPrevious
    }
  )((props) => <OriginalComponent {...props} />);

export default EnhancedPaginationContainer;