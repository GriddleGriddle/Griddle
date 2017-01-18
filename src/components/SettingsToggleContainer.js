import React from 'react';

import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';
import { isSettingsEnabledSelector, textSelector } from '../selectors/dataSelectors';
import { toggleSettings as toggleSettingsAction } from '../actions';

const enhancedSettingsToggle = OriginalComponent => compose(
  connect((state, props) => ({
    text: textSelector(state, { key: 'settingsToggle' }),
  }),
    {
      toggleSettings: toggleSettingsAction
    }
 ),
)(({ text, toggleSettings }) => <OriginalComponent
  text={text}
  onClick={toggleSettings}
/>);

export default enhancedSettingsToggle;
