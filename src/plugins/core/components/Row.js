import React from 'react';

const Row = ({ Cell, griddleKey, columnIds, onClick, onMouseEnter, onMouseLeave, style, className }) => (
  <tr
    key={griddleKey}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={style}
    className={className}
  >
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
