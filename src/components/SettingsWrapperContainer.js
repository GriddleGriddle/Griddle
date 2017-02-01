import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose } from 'recompose';

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
