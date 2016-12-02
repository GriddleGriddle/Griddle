import React from 'react';
import SpacerRow from './SpacerRow';

const TableBody = ({ rowIds, Row }) => (
  <tbody>
    <SpacerRow placement="top" />
    { rowIds && rowIds.map(r => <Row key={r} griddleKey={r} />) }
    <SpacerRow placement="bottom" />
  </tbody>
);

export default TableBody;
