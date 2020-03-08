import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import mapProps from 'recompose/mapProps';
import { combineHandlers } from '../utils/compositionUtils';
import GriddleContext from '../context/GriddleContext';

const EnhancedFilter = (OriginalComponent) =>
  mapProps((props) => {
    const griddleContext = useContext(GriddleContext);
    const { onFilter } = griddleContext.events;
    return {
      ...props,
      setFilter: combineHandlers([onFilter, props.setFilter])
    };
  })((props) => <OriginalComponent {...props} />);

export default EnhancedFilter;
