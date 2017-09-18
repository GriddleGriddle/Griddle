import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { isSettingsEnabledSelector, isSettingsVisibleSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const EnhancedSettingsWrapper = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object,
  }),
  connect(
    (state, props) => ({
      isEnabled: props.selectors.isSettingsEnabledSelector(state),
      isVisible: props.selectors.isSettingsVisibleSelector(state),
      className: props.selectors.classNamesForComponentSelector(state, 'SettingsWrapper'),
      style: props.selectors.stylesForComponentSelector(state, 'SettingsWrapper'),
    })
  ),
  mapProps(props => {
    const { components, ...otherProps } = props;
    return {
      Settings: components.Settings,
      SettingsToggle: components.SettingsToggle,
      ...otherProps
    }
  })
)(props => (
  <OriginalComponent {...props} />
));

export default EnhancedSettingsWrapper;
