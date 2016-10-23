import React from 'react';

const TableHeadingCell = ({ title, columnId, onClick, onMouseOver, onMouseOut, icon }) => (
  <th
    onClick={onClick}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
  >
    {title}
  </th>
)

export default TableHeadingCell;
