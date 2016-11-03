import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';
import { createStructuredSelector } from 'reselect';

import { hasNextSelector, hasPreviousSelector, currentPageSelector, maxPageSelector } from '../selectors/dataSelectors';

const EnhancedPaginationContainer = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  connect(
    createStructuredSelector({
      hasNext: hasNextSelector,
      hasPrevious: hasPreviousSelector,
      maxPages: maxPageSelector,
      currentPage: currentPageSelector
    }),
  ),
  mapProps(({ events: {onNext:getNext, onPrevious:getPrevious, onGetPage:setPage }, ...props }) => ({
    getNext,
    getPrevious,
    setPage,
    ...props
  }))
)((props) => <OriginalComponent {...props} />);

export default EnhancedPaginationContainer;
