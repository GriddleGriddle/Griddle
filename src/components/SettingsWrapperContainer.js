import React, { PropTypes } from 'react';

import { connect } from 'react-redux';

import { getContext, mapProps, compose } from 'recompose';

const EnhancedSettingsWrapper = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object,
  }),
  mapProps(props => ({
    selectors: props.selectors,
    Settings: props.components.Settings,
    SettingsToggle: props.components.SettingsToggle
  })),
  connect((state, props) => {
    const { isSettingsEnabledSelector, isSettingsVisibleSelector } = props.selectors;
    return {
      isEnabled: isSettingsEnabledSelector(state),
      isVisible: isSettingsVisibleSelector(state),
    };
  })
)(({ isEnabled, isVisible, SettingsToggle, Settings }) => (
  <OriginalComponent
    Settings={Settings}
    isEnabled={isEnabled}
    isVisible={isVisible}
    SettingsToggle={SettingsToggle}
  />
));

export default EnhancedSettingsWrapper;
