import React from 'react';

const TableHeading = ({ columnTitles, TableHeadingCell }) => {
  const headingCells = columnTitles.map(t => <TableHeadingCell key={t} title={t} />)

  return (
    <thead>
      <tr>
        { headingCells }
      </tr>
    </thead>
  );
}

export default TableHeading;
