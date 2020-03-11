import React from 'react';
import PropTypes from 'prop-types';
import { combineHandlers } from '../utils/compositionUtils';

const enhance = (OriginalComponent) => (props) => {
  const { onNext } = props.context.events;
  const nextBtnProps = {
    ...props,
    onClick: combineHandlers([onNext, props.onClick])
  };
  return <OriginalComponent {...nextBtnProps} />;
};

export default enhance;
