import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';

const EnhancedPaginationContainer = (OriginalComponent) =>
  connect((state, props) => ({
    className: classNamesForComponentSelector(state, 'Pagination'),
    style: stylesForComponentSelector(state, 'Pagination')
  }))((props) => {
    const paginationProps = {
      ...props,
      Next: props.context.components.NextButton,
      Previous: props.context.components.PreviousButton,
      PageDropdown: props.context.components.PageDropdown
    };
    return <OriginalComponent {...paginationProps} />;
  });

export default EnhancedPaginationContainer;
