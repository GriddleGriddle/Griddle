import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { combineHandlers } from '../utils/compositionUtils';
import GriddleContext from '../context/GriddleContext';

const enhance = (OriginalComponent) => (props) => {
  const griddleContext = useContext(GriddleContext);
  const { onNext } = griddleContext.events;
  const nextBtnProps = {
    ...props,
    onClick: combineHandlers([onNext, props.onClick])
  };
  return <OriginalComponent {...nextBtnProps} />;
};

export default enhance;
