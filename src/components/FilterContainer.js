import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import { classNamesForComponentSelector, stylesForComponentSelector, textSelector } from '../selectors/dataSelectors';
import { setFilter } from '../actions';

const EnhancedFilter = OriginalComponent => connect((state, props) => ({
  placeholder: textSelector(state, { key: 'filterPlaceholder' }),
  className: classNamesForComponentSelector(state, 'Filter'),
  style: stylesForComponentSelector(state, 'Filter'),
}), { setFilter })(props => <OriginalComponent {...props} />);

export default EnhancedFilter;
