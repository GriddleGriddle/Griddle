import React ,{ PropTypes } from 'react';

import { getContext, mapProps, compose } from 'recompose';

function getSettingsComponentsArrayFromObject(settingsObject) {
  //TODO: determine if we need to make this faster
  return settingsObject ? Object.keys(settingsObject)
    .map(key => settingsObject[key].component) : null;
}

const EnhancedSettings = OriginalComponent => compose(
  getContext({
    settingsComponentObjects: PropTypes.object
  }),
  mapProps(props => ({
    settingsComponents: getSettingsComponentsArrayFromObject(props.settingsComponentObjects),
    ...props,
  }))
)(({ settingsComponents }) => (
  <OriginalComponent settingsComponents={settingsComponents} />
));

export default EnhancedSettings;
