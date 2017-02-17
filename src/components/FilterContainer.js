import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';
import { setFilter } from '../actions';

const EnhancedFilter = OriginalComponent => connect((state, props) => ({
  className: classNamesForComponentSelector(state, 'Filter'),
  style: stylesForComponentSelector(state, 'Filter'),
}), { setFilter })(props => <OriginalComponent {...props} />);

export default EnhancedFilter;
