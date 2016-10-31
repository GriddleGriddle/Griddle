import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose } from 'recompose';
import { createStructuredSelector } from 'reselect';
import { hasNextSelector, hasPreviousSelector, currentPageSelector } from '../../../selectors/dataSelectors';
import { maxPageSelector } from '../selectors/controlledSelectors';

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
    })
  ),
  mapProps(props => {
    const { events: { getNext, getPrevious, setPage }, ...otherProps } = props;
    return {
      ...otherProps,
      getNext,
      getPrevious,
      setPage,
    };
  })
)((props) => {
  return (
    <OriginalComponent {...props} />
  );
});

export default EnhancedPaginationContainer;
