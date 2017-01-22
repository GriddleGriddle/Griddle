import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { currentPageSelector, maxPageSelector } from '../selectors/localSelectors';
import { setPage } from '../../../actions';

const enhance = OriginalComponent => connect(
  createStructuredSelector({
    maxPages: maxPageSelector,
    currentPage: currentPageSelector,
  }),
  {
    setPage
  }
)(props => <OriginalComponent {...props} />);

export default enhance;

