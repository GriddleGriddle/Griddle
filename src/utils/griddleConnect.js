import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/// This method appends options onto existing connect parameters
export const mergeConnectParametersWithOptions = (
  originalConnect,
  newOptions
) => {
  const [
    mapStateFromProps,
    mapDispatchFromProps,
    mergeProps,
    options
  ] = originalConnect;

  return [
    mapStateFromProps,
    mapDispatchFromProps,
    mergeProps,
    { ...options, ...newOptions }
  ];
};

const griddleConnect = (...connectOptions) => OriginalComponent =>
  class extends React.Component {
    static contextTypes = {
      storeKey: PropTypes.string
    };

    constructor(props, context) {
      super(props, context);
      const newOptions = mergeConnectParametersWithOptions(connectOptions, {
        storeKey: context.storeKey
      });
      this.ConnectedComponent = connect(...newOptions)(OriginalComponent);
    }

    render() {
      return <this.ConnectedComponent {...this.props} />;
    }
  };

export { griddleConnect as connect };
