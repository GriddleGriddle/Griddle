import React from 'react';

import { connect } from 'react-redux';

import { isSettingsEnabledSelector, textSelector } from '../selectors/dataSelectors';

const enhancedSettingsToggle = OriginalComponent => connect((state, props) => ({
  text: textSelector(state, { key: 'settingsToggle'})
}))(({text}) => <OriginalComponent text={text} />)

export default enhancedSettingsToggle;
