import React, { Component, PropTypes } from 'react';

class Griddle extends Component {
  static propTypes = {
    plugins: PropTypes.Array,
    data: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  render() {
    return <h1>Hi</h1>
  }
}
