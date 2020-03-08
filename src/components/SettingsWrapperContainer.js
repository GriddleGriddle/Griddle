import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import {
  isSettingsEnabledSelector,
  isSettingsVisibleSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

const EnhancedSettingsWrapper = (OriginalComponent) =>
  compose(
    mapProps((props) => {
      const griddleContext = useContext(GriddleContext);
      return {
        Settings: griddleContext.components.Settings,
        SettingsToggle: griddleContext.components.SettingsToggle
      };
    }),
    connect((state, props) => ({
      isEnabled: isSettingsEnabledSelector(state),
      isVisible: isSettingsVisibleSelector(state),
      className: classNamesForComponentSelector(state, 'SettingsWrapper'),
      style: stylesForComponentSelector(state, 'SettingsWrapper')
    }))
  )((props) => <OriginalComponent {...props} />);

export default EnhancedSettingsWrapper;
