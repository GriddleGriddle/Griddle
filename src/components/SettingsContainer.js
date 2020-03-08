import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

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
  compose(
    connect((state, props) => ({
      className: classNamesForComponentSelector(state, 'Settings'),
      style: stylesForComponentSelector(state, 'Settings')
    })),
    mapProps((props) => {
      const griddleContext = useContext(GriddleContext);
      const { components, settingsComponentObjects } = griddleContext;
      return {
        settingsComponents: getSettingsComponentsArrayFromObject(
          settingsComponentObjects,
          components.SettingsComponents
        ),
        ...props
      };
    })
  )((props) => <OriginalComponent {...props} />);

export default EnhancedSettings;
