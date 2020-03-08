import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

const EnhancedLayout = (OriginalComponent) =>
  compose(
    connect((state, props) => ({
      className: classNamesForComponentSelector(state, 'Layout'),
      style: stylesForComponentSelector(state, 'Layout')
    })),
    mapProps((props) => {
      const griddleContext = useContext(GriddleContext);
      return {
        Table: griddleContext.components.Table,
        Pagination: griddleContext.components.Pagination,
        Filter: griddleContext.components.Filter,
        SettingsWrapper: griddleContext.components.SettingsWrapper,
        Style: griddleContext.components.Style,
        className: props.className,
        style: props.style
      };
    })
  )((props) => <OriginalComponent {...props} />);

export default EnhancedLayout;
