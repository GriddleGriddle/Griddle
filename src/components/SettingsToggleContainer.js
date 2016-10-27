import React from 'react';

import { connect } from 'react-redux';

import { isSettingsEnabledSelector, textSelector } from '../selectors/dataSelectors';

const enhancedSettingsToggle = OriginalComponent => connect((state, props) => ({
  showSettings: isSettingsEnabledSelector(state),
  text: textSelector(state, { key: 'settingsToggle'})
}))(({showSettings, text}) => showSettings ? <OriginalComponent text={text} /> : null )

export default enhancedSettingsToggle;
