import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import { classNamesForComponentSelector, stylesForComponentSelector, textSelector } from '../selectors/dataSelectors';
import { setFilter } from '../actions';

const EnhancedFilter = OriginalComponent => connect((state, props) => ({
  text: textSelector(state, { key: 'filterPlaceHolder' }),
  className: classNamesForComponentSelector(state, 'Filter'),
  style: stylesForComponentSelector(state, 'Filter'),
}), { setFilter })(props => <OriginalComponent {...props} />);

export default EnhancedFilter;
