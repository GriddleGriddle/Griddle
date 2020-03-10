import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { combineHandlers } from '../utils/compositionUtils';
import GriddleContext from '../context/GriddleContext';

const enhance = (OriginalComponent) => (props) => {
  const griddleContext = useContext(GriddleContext);
  const { onGetPage } = griddleContext.events;
  const dropdownEnhancerProps = {
    ...props,
    setPage: combineHandlers([onGetPage, props.setPage])
  };
  return <OriginalComponent {...dropdownEnhancerProps} />;
};
export default enhance;
