import React from 'react';

const TableHeadingCell = ({ title, columnId, onClick, onMouseOver, onMouseOut, icon }) => (
  <th
    onClick={onClick}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
  >
    { title }
    { icon && <span>{icon}</span> }
  </th>
)

export default TableHeadingCell;
