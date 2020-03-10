import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  isSettingsEnabledSelector,
  isSettingsVisibleSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

const EnhancedSettingsWrapper = (OriginalComponent) =>
  connect((state, props) => ({
    isEnabled: isSettingsEnabledSelector(state),
    isVisible: isSettingsVisibleSelector(state),
    className: classNamesForComponentSelector(state, 'SettingsWrapper'),
    style: stylesForComponentSelector(state, 'SettingsWrapper')
  }))((props) => {
    const griddleContext = useContext(GriddleContext);
    const settingsProps = {
      ...props,
      Settings: griddleContext.components.Settings,
      SettingsToggle: griddleContext.components.SettingsToggle
    };
    return <OriginalComponent {...settingsProps} />;
  });

export default EnhancedSettingsWrapper;
