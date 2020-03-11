import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';

const EnhancedLayout = (OriginalComponent) =>
  connect((state, props) => ({
    className: classNamesForComponentSelector(state, 'Layout'),
    style: stylesForComponentSelector(state, 'Layout')
  }))((props) => {
    const layoutProps = {
      Table: props.context.components.Table,
      Pagination: props.context.components.Pagination,
      Filter: props.context.components.Filter,
      SettingsWrapper: props.context.components.SettingsWrapper,
      Style: props.context.components.Style,
      className: props.className,
      style: props.style
    };
    return <OriginalComponent {...layoutProps} />;
  });

export default EnhancedLayout;
