import React ,{ PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

function getSettingsComponentsArrayFromObject(settingsObject) {
  //TODO: determine if we need to make this faster
  return settingsObject ? Object.keys(settingsObject)
    .map(key => settingsObject[key].component) : null;
}

const EnhancedSettings = OriginalComponent => compose(
  getContext({
    settingsComponentObjects: PropTypes.object
  }),
  connect(
    (state, props) => ({
      className: classNamesForComponentSelector(state, 'Settings'),
      style: stylesForComponentSelector(state, 'Settings'),
    })
  ),
  mapProps(props => {
    const { settingsComponentObjects, ...otherProps } = props;
    return {
      settingsComponents: getSettingsComponentsArrayFromObject(settingsComponentObjects),
      ...otherProps,
    };
  })
)(props => (
  <OriginalComponent {...props} />
));

export default EnhancedSettings;
