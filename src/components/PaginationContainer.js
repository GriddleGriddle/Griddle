import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

const EnhancedPaginationContainer = (OriginalComponent) =>
  connect((state, props) => ({
    className: classNamesForComponentSelector(state, 'Pagination'),
    style: stylesForComponentSelector(state, 'Pagination')
  }))((props) => {
    const griddleContext = useContext(GriddleContext);
    const paginationProps = {
      Next: griddleContext.components.NextButton,
      Previous: griddleContext.components.PreviousButton,
      PageDropdown: griddleContext.components.PageDropdown,
      ...props
    };
    return <OriginalComponent {...paginationProps} />;
  });

export default EnhancedPaginationContainer;
