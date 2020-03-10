import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

const EnhancedLayout = (OriginalComponent) =>
  connect((state, props) => ({
    className: classNamesForComponentSelector(state, 'Layout'),
    style: stylesForComponentSelector(state, 'Layout')
  }))((props) => {
    const griddleContext = useContext(GriddleContext);
    const layoutProps = {
      Table: griddleContext.components.Table,
      Pagination: griddleContext.components.Pagination,
      Filter: griddleContext.components.Filter,
      SettingsWrapper: griddleContext.components.SettingsWrapper,
      Style: griddleContext.components.Style,
      className: props.className,
      style: props.style
    };
    return <OriginalComponent {...layoutProps} />;
  });

export default EnhancedLayout;
