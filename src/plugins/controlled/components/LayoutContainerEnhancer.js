import React, { Component, PropTypes } from 'react';

const EnhancedLayoutContainer = OriginalComponent => class extends Component {
  static childContextTypes = {
    events: React.PropTypes.object
  }

  getChildContext() {
    return { events: this.props.events };
  }

  constructor(props, context) {
    super(props, context);
    const { events, ...filteredProps } = this.props;

    this._filteredProps = filteredProps;
  }

  render() {
    return <OriginalComponent {...this._filteredProps} />
  }
};

export default EnhancedLayoutContainer;
