import React from 'react';

const TableHeading = ({ columnTitles, columnIds, TableHeadingCell }) => {
  const headingCells = columnTitles.map((t, i) => <TableHeadingCell key={t} title={t} columnId={columnIds[i]} />)

  return (
    <thead>
      <tr>
        { headingCells }
      </tr>
    </thead>
  );
}

export default TableHeading;
