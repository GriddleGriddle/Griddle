import React from 'react';

const Cell = ({ value, onMouseEnter, onClick, className, style, onMouseLeave }) => (
  <td
    style={style}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={className}
  >
    {value}
  </td>
);

export default Cell;
