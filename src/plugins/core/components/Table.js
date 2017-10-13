import React from 'react';

export const Table = ({ TableHeading, TableBody, Loading, NoResults, style, className, dataLoading, visibleRows }) =>
  dataLoading ? (Loading && <Loading />) :
  visibleRows > 0 ?
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
