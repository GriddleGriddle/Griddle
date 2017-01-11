import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';
import { createStructuredSelector } from 'reselect';

const EnhancedPaginationContainer = OriginalComponent => compose(
  getContext({
    events: PropTypes.object,
    selectors: PropTypes.object,
  }),
  connect((state, props) => {
    const { hasNextSelector, hasPreviousSelector, currentPageSelector, maxPageSelector } = props.selectors;
    return createStructuredSelector({
      hasNext: hasNextSelector,
      hasPrevious: hasPreviousSelector,
      maxPages: maxPageSelector,
      currentPage: currentPageSelector
    })(state, props);
  }),
  mapProps(({ events: {onNext:getNext, onPrevious:getPrevious, onGetPage:setPage }, ...props }) => ({
    getNext,
    getPrevious,
    setPage,
    ...props
  }))
)((props) => <OriginalComponent {...props} />);

export default EnhancedPaginationContainer;
