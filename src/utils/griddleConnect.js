import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux-custom-store';

const griddleConnect = (...connectOptions) => OriginalComponent => class extends React.Component {
  static contextTypes = {
    storeName: PropTypes.string,
  }

  render() {
    const ConnectedComponent = connect(...connectOptions)(OriginalComponent, this.context.storeName);

    return <ConnectedComponent {...this.props}/>
  }
}

export { griddleConnect as connect }
