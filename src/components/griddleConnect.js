import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux-custom-store';
import getContext from 'recompose/getContext';


const griddleConnect = (...connectOptions) => OriginalComponent => class extends React.Component {
  static contextTypes = {
    storeName: PropTypes.string,
  }

  render() {
    console.log(this.context.storeName)
    const ConnectedComponent = connect(...connectOptions)(OriginalComponent, this.context.storeName);

    return <ConnectedComponent {...this.props}/>
  }
}

export { griddleConnect as connect }
