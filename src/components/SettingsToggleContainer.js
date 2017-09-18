import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';
import { textSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';
import { toggleSettings as toggleSettingsAction } from '../actions';

const enhancedSettingsToggle = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object
  }),
  connect((state, props) => ({
    text: props.selectors.textSelector(state, { key: 'settingsToggle' }),
    className: props.selectors.classNamesForComponentSelector(state, 'SettingsToggle'),
    style: props.selectors.stylesForComponentSelector(state, 'SettingsToggle'),
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
