import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { combineHandlers } from '../utils/compositionUtils';
import GriddleContext from '../context/GriddleContext';

const enhance = (OriginalComponent) => (props) => {
  const griddleContext = useContext(GriddleContext);
  const { onPrevious } = griddleContext.events;
  const previousBtnProps = {
    ...props,
    onClick: combineHandlers([onPrevious, props.onClick])
  };
  return <OriginalComponent {...previousBtnProps} />;
};

export default enhance;
