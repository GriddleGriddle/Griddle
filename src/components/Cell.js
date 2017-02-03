import React from 'react';

const Cell = ({ value, onMouseOver, onClick, className, style, onMouseOut }) => (
  <td
    style={style}
    onClick={onClick}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    className={className}
  >
    {value}
  </td>
);

export default Cell;
