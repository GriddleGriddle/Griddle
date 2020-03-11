import React from 'react';
import PropTypes from 'prop-types';
import { combineHandlers } from '../utils/compositionUtils';

const enhance = (OriginalComponent) => (props) => {
  const { onPrevious } = props.context.events;
  const previousBtnProps = {
    ...props,
    onClick: combineHandlers([onPrevious, props.onClick])
  };
  return <OriginalComponent {...previousBtnProps} />;
};

export default enhance;
