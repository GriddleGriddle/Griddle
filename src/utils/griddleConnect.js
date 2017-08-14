import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


/// This method appends options onto existing connect parameters
export const mergeConnectParametersWithOptions = (originalConnect, newOptions) => {
  const [mapStateFromProps, mapDispatchFromProps, mergeProps, options] = originalConnect;

  return [
    mapStateFromProps,
    mapDispatchFromProps,
    mergeProps,
    { ...options, ...newOptions }
  ];
}

const griddleConnect = (...connectOptions) => OriginalComponent => class extends React.Component {
  static contextTypes = {
    storeKey: PropTypes.string,
  }

  render() {
    const newOptions = mergeConnectParametersWithOptions(connectOptions, { storeKey: this.context.storeKey })
    const ConnectedComponent = connect(...newOptions)(OriginalComponent);

    return <ConnectedComponent {...this.props}/>
  }
}

export { griddleConnect as connect }
