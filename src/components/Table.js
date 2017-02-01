import React from 'react';

export const Table = ({ TableHeading, TableBody, style, className }) =>  (
  <table style={style} className={className}>
    <TableHeading />
    <TableBody />
  </table>
);

export default Table;
