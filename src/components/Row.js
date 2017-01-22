import React from 'react';

const Row = ({Cell, griddleKey, columnIds, style, className}) => (
  <tr>
    { columnIds && columnIds.map(c => (
      <Cell
        key={`${c}-${griddleKey}`}
        griddleKey={griddleKey}
        columnId={c}
        style={style}
        className={className}
      />
    ))}
  </tr>
);

export default Row;
