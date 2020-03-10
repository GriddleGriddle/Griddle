import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GriddleContext from '../context/GriddleContext';
/// This method appends options onto existing connect parameters
export const mergeConnectParametersWithOptions = (originalConnect, newOptions) => {
  const [mapStateFromProps, mapDispatchFromProps, mergeProps, options] = originalConnect;

  return [mapStateFromProps, mapDispatchFromProps, mergeProps, { ...options, ...newOptions }];
};

const griddleConnect = (...connectOptions) => (OriginalComponent) =>
  class extends React.Component {
    static contextType = GriddleContext;
    constructor(props, context) {
      super(props, context);
      const newOptions = mergeConnectParametersWithOptions(connectOptions);
      this.ConnectedComponent = connect(...newOptions)(OriginalComponent);
    }

    render() {
      return <this.ConnectedComponent {...this.props} context={this.context} />;
    }
  };

export { griddleConnect as connect };
