import React from 'react';
import PropTypes from 'prop-types';
import { combineHandlers } from '../utils/compositionUtils';

const EnhancedFilter = (OriginalComponent) => (props) => {
  const { onFilter } = props.context.events;
  const filterProps = {
    ...props,
    setFilter: combineHandlers([onFilter, props.setFilter])
  };
  return <OriginalComponent {...filterProps} />;
};

export default EnhancedFilter;
