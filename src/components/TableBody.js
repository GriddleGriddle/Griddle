import React from 'react';

const TableBody = ({ rowIds, Row, style, className }) => (
  <tbody style={style} className={className}>
    { rowIds && rowIds.map(r => <Row key={r} griddleKey={r} />) }
  </tbody>
);

export default TableBody;
