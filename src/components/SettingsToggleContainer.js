import React, { PropTypes } from 'react';

import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';

import { toggleSettings as toggleSettingsAction } from '../actions';

const enhancedSettingsToggle = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object,
  }),
  connect((state, props) =>
   {
     const { textSelector } = props.selectors;
     return {
       text: textSelector(state, { key: 'settingsToggle'}),
     };
   },
   {
     toggleSettings: toggleSettingsAction
   }
 ),
)(({ text, toggleSettings }) => <OriginalComponent
  text={text}
  onClick={toggleSettings}
/>);

export default enhancedSettingsToggle;
