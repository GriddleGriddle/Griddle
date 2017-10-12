import React, { Component } from 'react';

class Cell extends Component {
  componentWillUnmount() {
    console.log('unmounting!');
  }
  render() {
    const { value, onClick, onMouseEnter, onMouseLeave, style, className } = this.props;

    return (
      <td
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={style}
        className={className}
      >
        {value}
      </td>
    );
  }
}

export default Cell;
