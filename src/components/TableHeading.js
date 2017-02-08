import React from 'react';

const TableHeading = ({ columnTitles, columnIds, TableHeadingCell, style, className }) => {
  const headingCells = columnTitles && columnTitles.map((t, i) => <TableHeadingCell key={t} title={t} columnId={columnIds[i]} />);

  return (
    <thead style={style} className={className}>
      <tr>
        { headingCells }
      </tr>
    </thead>
  );
}

export default TableHeading;
