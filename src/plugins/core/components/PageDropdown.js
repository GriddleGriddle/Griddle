import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/** Gets a range from a single value.
 * TODO: Could probably make this take a predicate to avoid running through the loop twice */
const getRange = (number) => {
 if (!_.isFinite(number)) { return [0] }

 return Array(number).fill().map((_, i) => i + 1);
}

class PageDropdown extends Component {
  static propTypes = {
    maxPages: PropTypes.number,
    currentPage: PropTypes.number,
    setPage: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  }

  setPage = (e) => {
    this.props.setPage(parseInt(e.target.value));
  }

  render() {
    const { currentPage, maxPages } = this.props;

    return (
      <select
        onChange={this.setPage}
        value={currentPage}
        style={this.props.style}
        className={this.props.className}
      >
        {getRange(maxPages)
          .map(num => (
            <option key={num} value={num}>{num}</option>
        ))}
      </select>
    );
  }
}

export default PageDropdown;
