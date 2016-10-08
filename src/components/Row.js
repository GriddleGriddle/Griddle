import React from 'react';

const Row = ({Cell, griddleKey, columnIds}) => (
  <tr>
    { columnIds && columnIds.map(c => (
      <Cell
        griddleKey={griddleKey}
        columnId={c}
      />
    ))}
  </tr>
);

export default Row;
