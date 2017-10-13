import React from 'react';

const TableBody = ({ rowIds, Row, style, className }) => (
  <tbody style={style} className={className}>
    { rowIds && rowIds.map((k, i) => <Row key={k} griddleKey={k} index={i} />) }
  </tbody>
);

export default TableBody;
