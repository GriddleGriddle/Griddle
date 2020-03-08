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

const LoadingContainer = compose(
  connect((state) => ({
    className: classNamesForComponentSelector(state, 'Loading'),
    style: stylesForComponentSelector(state, 'Loading')
  })),
  mapProps((props) => {
    const griddleContext = useContext(GriddleContext);
    return {
      Loading: griddleContext.components.Loading,
      ...props
    };
  })
);

export default LoadingContainer;
