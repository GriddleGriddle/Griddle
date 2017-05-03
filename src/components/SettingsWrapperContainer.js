import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { isSettingsEnabledSelector, isSettingsVisibleSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const EnhancedSettingsWrapper = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
  }),
  mapProps(props => ({
    Settings: props.components.Settings,
    SettingsToggle: props.components.SettingsToggle
  })),
  connect((state, props) => ({
    isEnabled: isSettingsEnabledSelector(state),
    isVisible: isSettingsVisibleSelector(state),
    className: classNamesForComponentSelector(state, 'SettingsWrapper'),
    style: stylesForComponentSelector(state, 'SettingsWrapper'),
  }))
)(props => (
  <OriginalComponent {...props} />
));

export default EnhancedSettingsWrapper;
