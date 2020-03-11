import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  isSettingsEnabledSelector,
  isSettingsVisibleSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';

const EnhancedSettingsWrapper = (OriginalComponent) =>
  connect((state, props) => ({
    isEnabled: isSettingsEnabledSelector(state),
    isVisible: isSettingsVisibleSelector(state),
    className: classNamesForComponentSelector(state, 'SettingsWrapper'),
    style: stylesForComponentSelector(state, 'SettingsWrapper')
  }))((props) => {
    const settingsProps = {
      ...props,
      Settings: props.context.components.Settings,
      SettingsToggle: props.context.components.SettingsToggle
    };
    return <OriginalComponent {...settingsProps} />;
  });

export default EnhancedSettingsWrapper;
