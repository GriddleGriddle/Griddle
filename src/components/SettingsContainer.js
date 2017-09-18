import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

//import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

function getSettingsComponentsArrayFromObject(settingsObject, settingsComponents) {
  //TODO: determine if we need to make this faster
  return settingsObject ? Object.keys(settingsObject)
    .sort((a, b) => {
      var oa = settingsObject[a], ob = settingsObject[b];
      return ((oa && oa.order) || 0) - ((ob && ob.order) || 0);
    })
    .map(key => settingsObject[key] && (settingsObject[key].component || (settingsComponents && settingsComponents[key]))) : null;
}

const EnhancedSettings = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object,
    settingsComponentObjects: PropTypes.object
  }),
  connect(
    (state, props) => ({
      className: props.selectors.classNamesForComponentSelector(state, 'Settings'),
      style: props.selectors.stylesForComponentSelector(state, 'Settings'),
    })
  ),
  mapProps(props => {
    const { components, settingsComponentObjects, ...otherProps } = props;
    return {
      settingsComponents: getSettingsComponentsArrayFromObject(settingsComponentObjects, components.SettingsComponents),
      ...otherProps,
    };
  })
)(props => (
  <OriginalComponent {...props} />
));

export default EnhancedSettings;
