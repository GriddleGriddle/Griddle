import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getContext from 'recompose/getContext';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';

import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const EnhancedLayout = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  connect(
    (state, props) => ({
      className: classNamesForComponentSelector(state, 'Layout'),
      style: stylesForComponentSelector(state, 'Layout'),
    })
  ),
  mapProps( props => ({
    Table: props.components.Table,
    Pagination: props.components.Pagination,
    Filter: props.components.Filter,
    SettingsWrapper: props.components.SettingsWrapper,
    Style: props.components.Style,
    className: props.className,
    style: props.style,
  }))
)(props => (
  <OriginalComponent
    {...props}
  />
));

export default EnhancedLayout;
