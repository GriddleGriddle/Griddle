import React, { Component, PropTypes } from 'react';

class Filter extends Component {
  static propTypes = {
    setFilter: PropTypes.func
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
      />
    )
  }
}

export default Filter;