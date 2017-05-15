import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux-custom-store'
import getContext from 'recompose/getContext';
import compose from 'recompose/compose';

const GriddleConnect = getContext({
  griddleStoreName: PropTypes.string,
  components: PropTypes.object
})(props => {
  const { griddleStoreName } = props;
  return (...args) => {
    return (component) => {
      debugger;
      //  griddleStoreName
      return connect(...args)(component, 'store');
    }
  }
});

export default GriddleConnect;
