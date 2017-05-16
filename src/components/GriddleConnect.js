import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux-custom-store'
import getContext from 'recompose/getContext';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';

const GriddleConnect = (...args) => {
  return (component) => {
    return connect(...args)(component, 'griddle-store');
  }
}
//
// const GriddleConnectTest = (...args) => {
//   return (component) => compose(
//     getContext({
//       griddleStoreName: PropTypes.string,
//     })
//   )(({ griddleStoreName = 'store'}) => {
//     const connectedComponent = connect(...args)(component, griddleStoreName);
//     debugger;
//     return connectedComponent;
//   })
// }

export default GriddleConnect;
