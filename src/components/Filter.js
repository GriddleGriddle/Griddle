import React, { Component, PropTypes } from 'react';

class Filter extends Component {
  static propTypes = {
    setFilter: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  }

  setFilter = (e) => {
    this.props.setFilter(e.target.value);
  }

  render() {
    return (
      <input
        type="text"
        name="filter"
        placeholder="Filter"
        onChange={this.setFilter}
        style={this.props.style}
        className={this.props.className}
      />
    )
  }
}

export default Filter;
