import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';

import { connect } from '../utils/griddleConnect';

const enhancedSettingsToggle = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object,
    actions: PropTypes.object,
  }),
  connect(
    (state, props) => ({
      text: props.selectors.textSelector(state, { key: 'settingsToggle' }),
      className: props.selectors.classNamesForComponentSelector(state, 'SettingsToggle'),
      style: props.selectors.stylesForComponentSelector(state, 'SettingsToggle'),
    }),
    (dispatch, props) => ({
      toggleSettings: () => dispatch(props.actions.toggleSettings())
    })
 ),
)(props => <OriginalComponent
  {...props}
  onClick={props.toggleSettings}
/>);

export default enhancedSettingsToggle;
