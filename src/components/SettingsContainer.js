import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';

function getSettingsComponentsArrayFromObject(settingsObject, settingsComponents) {
  //TODO: determine if we need to make this faster
  return settingsObject
    ? Object.keys(settingsObject)
        .sort((a, b) => {
          var oa = settingsObject[a],
            ob = settingsObject[b];
          return ((oa && oa.order) || 0) - ((ob && ob.order) || 0);
        })
        .map(
          (key) =>
            settingsObject[key] &&
            (settingsObject[key].component || (settingsComponents && settingsComponents[key]))
        )
    : null;
}

const EnhancedSettings = (OriginalComponent) =>
  connect((state, props) => ({
    className: classNamesForComponentSelector(state, 'Settings'),
    style: stylesForComponentSelector(state, 'Settings')
  }))((props) => {
    const { components, settingsComponentObjects } = props.context;
    const settingsProps = {
      settingsComponents: getSettingsComponentsArrayFromObject(
        settingsComponentObjects,
        components.SettingsComponents
      ),
      ...props
    };
    return <OriginalComponent {...settingsProps} />;
  });

export default EnhancedSettings;
