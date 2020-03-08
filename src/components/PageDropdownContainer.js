import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import {
  currentPageSelector,
  maxPageSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';

const enhance = connect((state, props) => ({
  maxPages: maxPageSelector(state, props),
  currentPage: currentPageSelector(state, props),
  className: classNamesForComponentSelector(state, 'PageDropdown'),
  style: stylesForComponentSelector(state, 'PageDropdown')
}));

export default enhance;
