import React from 'react';

const TableBody = ({ rowIds, Row, style, className, extTrigger}) => {
  return (
    <tbody style={style} className={className}>
      { rowIds && rowIds.map((k, i) => <Row key={k} griddleKey={k} index={i} />) }
      <tr>
      <td colSpan="3">
       This Button will use an external callback, brought in by the TableContainer (set in Griddle props), This trigger will print something and try to set state in the external context, but It fails
       <button onClick={extTrigger}> Try me </button>
      </td>
      </tr>
    </tbody>
  )};

export default TableBody;
