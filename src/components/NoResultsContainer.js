import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

const NoResultsContainer = (OriginalComponent) =>
  compose(
    connect((state) => ({
      className: classNamesForComponentSelector(state, 'NoResults'),
      style: stylesForComponentSelector(state, 'NoResults')
    })),
    mapProps((props) => {
      const griddleContext = React.useContext(GriddleContext);
      return {
        NoResults: griddleContext.components.NoResults,
        ...props
      };
    })
  )((props) => <OriginalComponent {...props} />);

export default NoResultsContainer;
