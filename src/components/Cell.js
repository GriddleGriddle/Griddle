import React from 'react';

const Cell = ({ value, onClick, onMouseEnter, onMouseLeave, style, className }) => (
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

export default Cell;
