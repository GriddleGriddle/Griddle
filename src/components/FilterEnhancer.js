import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { combineHandlers } from '../utils/compositionUtils';
import GriddleContext from '../context/GriddleContext';

const EnhancedFilter = (OriginalComponent) => (props) => {
  const griddleContext = useContext(GriddleContext);
  const { onFilter } = griddleContext.events;
  const filterProps = {
    ...props,
    setFilter: combineHandlers([onFilter, props.setFilter])
  };
  return <OriginalComponent {...filterProps} />;
};

export default EnhancedFilter;
