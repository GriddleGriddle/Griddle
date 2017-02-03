import React from 'react';

const TableHeadingCell = ({ title, columnId, onClick, onMouseOver, onMouseOut, icon, style, className }) => (
  <th
    onClick={onClick}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    style={style}
    className={className}
  >
    {title}
  </th>
)

export default TableHeadingCell;
