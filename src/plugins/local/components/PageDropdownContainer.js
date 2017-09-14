import React from 'react';
import { connect } from '../../../utils/griddleConnect';
import { createStructuredSelector } from 'reselect';

import { currentPageSelector, maxPageSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/localSelectors';
import { setPage } from '../../../actions';

const enhance = OriginalComponent => connect(state => ({
  maxPages: maxPageSelector(state),
  currentPage: currentPageSelector(state),
  className: classNamesForComponentSelector(state, 'PageDropdown'),
  style: stylesForComponentSelector(state, 'PageDropdown'),
}),
  {
    setPage
  }
)(props => <OriginalComponent {...props} />);

export default enhance;

