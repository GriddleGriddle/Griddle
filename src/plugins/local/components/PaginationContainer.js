import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { hasNextSelector, hasPreviousSelector, currentPageSelector, maxPageSelector } from '../selectors/localSelectors';
import { getNext, getPrevious, setPage } from '../../../actions';

const EnhancedPaginationContainer = OriginalComponent => connect(
    createStructuredSelector({
      hasNext: hasNextSelector,
      hasPrevious: hasPreviousSelector,
      maxPages: maxPageSelector,
      currentPage: currentPageSelector
    }),
    {
      getNext,
      getPrevious,
      setPage
    }
  )((props) => <OriginalComponent {...props} />);

export default EnhancedPaginationContainer;