import React from 'react';

export const Table = ({ TableHeading, TableBody, NoResults, style, className, visibleRows }) =>  visibleRows > 0 ?
  (
    <table style={style} className={className}>
      { TableHeading && <TableHeading /> }
      { TableBody && <TableBody /> }
    </table>
  ) :
  (
    NoResults && <NoResults />
  );

export default Table;
