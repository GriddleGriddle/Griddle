import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

const EnhancedPaginationContainer = (OriginalComponent) =>
  compose(
    connect((state, props) => ({
      className: classNamesForComponentSelector(state, 'Pagination'),
      style: stylesForComponentSelector(state, 'Pagination')
    })),
    mapProps((props) => {
      const griddleContext = useContext(GriddleContext);
      return {
        Next: griddleContext.components.NextButton,
        Previous: griddleContext.components.PreviousButton,
        PageDropdown: griddleContext.components.PageDropdown,
        ...props
      };
    })
  )((props) => <OriginalComponent {...props} />);

export default EnhancedPaginationContainer;
