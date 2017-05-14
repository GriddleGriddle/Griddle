import React from 'react';
import { connect } from 'react-redux-custom-store'
import getContext from 'recompose/getContext';
import compose from 'recompose/compose';

const GriddleConnect = getContext({
  storeName: PropTypes.object,
})({ storeName }) => {
  return (mapStateToProps, mapDispatchToProps) => (component) => {
    return connect(mapStateToProps, mapDispatchToProps)(component, storeName);
  }
};

export default GriddleConnect;
