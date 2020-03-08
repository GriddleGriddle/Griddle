import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import mapProps from 'recompose/mapProps';
import { combineHandlers } from '../utils/compositionUtils';
import GriddleContext from '../context/GriddleContext';

const enhance = (OriginalComponent) =>
  mapProps((props) => {
    const griddleContext = useContext(GriddleContext);
    const { onGetPage } = griddleContext.events;
    return {
      ...props,
      setPage: combineHandlers([onGetPage, props.setPage])
    };
  })((props) => <OriginalComponent {...props} />);

export default enhance;
