import React from 'react';

const TableHeadingCell = ({ title, columnId, onClick, onMouseEnter, onMouseLeave, icon, style, className }) => (
  <th
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={style}
    className={className}
  >
    {title}
  </th>
)

export default TableHeadingCell;
