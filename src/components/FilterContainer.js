import React from 'react';
import { connect } from 'react-redux';
import { setFilter } from '../actions';

const EnhancedFilterContainer = OriginalComponent => connect(
  null,
  {
    setFilter
  }
)((props) => <OriginalComponent {...props} />);

export default EnhancedFilterContainer;