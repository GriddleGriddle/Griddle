import React from 'react';

const Cell = ({ value, onMouseOver, onClick, className, style, onMouseOut }) => console.log('width', style) || (
  <td
    style={style}
    onClick={onClick}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    className={className}
    style={style}
  >
    {value}
  </td>
);

export default Cell;
