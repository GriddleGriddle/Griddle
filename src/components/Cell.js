import React from 'react';

const Cell = ({value, onMouseOver, onClick, className, style}) => (
      <td
        style={style}
        onClick={onClick}
        onMouseOver={onMouseOver}
        className={className}
      >
        {value}
      </td>
);

export default Cell;
