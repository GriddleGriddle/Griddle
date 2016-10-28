import React from 'react';

import { connect } from 'react-redux';

import { isSettingsEnabledSelector, textSelector } from '../selectors/dataSelectors';
import { toggleSettings as toggleSettingsAction } from '../actions';

const enhancedSettingsToggle = OriginalComponent => connect((state, props) =>
  ({
    text: textSelector(state, { key: 'settingsToggle'})
  }),
  {
    toggleSettings: toggleSettingsAction
  }
)(({ text, toggleSettings }) => <OriginalComponent
  text={text}
  onClick={toggleSettings}
/>)

export default enhancedSettingsToggle;
