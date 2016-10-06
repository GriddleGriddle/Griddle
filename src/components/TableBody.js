import React from 'react';

const TableBody = ({ rowIds, Row }) => (
  <tbody>
    { rowIds && rowIds.map(r => <Row key={r} griddleKey={r} />) }
  </tbody>
);

export default TableBody;
