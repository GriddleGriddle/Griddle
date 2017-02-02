import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { currentPageSelector, maxPageSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/localSelectors';
import { setPage } from '../../../actions';

const enhance = OriginalComponent => connect(state =>
  createStructuredSelector({
    maxPages: maxPageSelector,
    currentPage: currentPageSelector,
    className: classNamesForComponentSelector(state, 'PageDropdown'),
    style: stylesForComponentSelector(state, 'PageDropdown'),
  }),
  {
    setPage
  }
)(props => <OriginalComponent {...props} />);

export default enhance;

