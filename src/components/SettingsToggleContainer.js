import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { textSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';
import { toggleSettings as toggleSettingsAction } from '../actions';

const enhancedSettingsToggle = OriginalComponent => compose(
  connect((state, props) => ({
    text: textSelector(state, { key: 'settingsToggle' }),
    className: classNamesForComponentSelector(state, 'SettingsToggle'),
    style: stylesForComponentSelector(state, 'SettingsToggle'),
  }),
    {
      toggleSettings: toggleSettingsAction
    }
 ),
)(props => <OriginalComponent
  {...props}
  onClick={props.toggleSettings}
/>);

export default enhancedSettingsToggle;
