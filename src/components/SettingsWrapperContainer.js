import React, { PropTypes } from 'react';

import { connect } from 'react-redux';

import { getContext, mapProps, compose } from 'recompose';

const EnhancedSettingsWrapper = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  mapProps(props => ({
    Settings: null,
    SettingsToggle: props.components.SettingsToggle
  })),
  connect((state, props) => ({
    isEnabled: isSettingsEnabledSelector(state),
  }))
)(({ isEnabled, SettingsToggle, Settings }) => (
  <OriginalComponent
    Settings={Settings}
    isEnabled={isEnabled}
    SettingsToggle={SettingsToggle}
  />
));

export default EnhancedSettingsWrapper;
