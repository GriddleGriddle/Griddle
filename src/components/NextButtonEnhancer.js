import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import mapProps from 'recompose/mapProps';
import { combineHandlers } from '../utils/compositionUtils';
import GriddleContext from '../context/GriddleContext';

const enhance = (OriginalComponent) =>
  mapProps((props) => {
    const griddleContext = useContext(GriddleContext);
    const { onNext } = griddleContext.events;
    return {
      ...props,
      onClick: combineHandlers([onNext, props.onClick])
    };
  })((props) => <OriginalComponent {...props} />);

export default enhance;
