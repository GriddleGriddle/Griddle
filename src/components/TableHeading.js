import React from 'react';

const TableHeading = ({ columnTitles, columnIds, TableHeadingCell, style, className }) => {
  const headingCells = columnIds && columnTitles && columnTitles.map((t, i) => <TableHeadingCell key={columnIds[i]} title={t} columnId={columnIds[i]} />);

  return (
    <thead style={style} className={className}>
      <tr>
        { headingCells }
      </tr>
    </thead>
  );
}

export default TableHeading;
