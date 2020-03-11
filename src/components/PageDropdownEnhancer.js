import React from 'react';
import PropTypes from 'prop-types';
import { combineHandlers } from '../utils/compositionUtils';

const enhance = (OriginalComponent) => (props) => {
  const { onGetPage } = props.context.events;
  const dropdownEnhancerProps = {
    ...props,
    setPage: combineHandlers([onGetPage, props.setPage])
  };
  return <OriginalComponent {...dropdownEnhancerProps} />;
};
export default enhance;
