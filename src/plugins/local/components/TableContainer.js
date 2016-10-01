import React from 'react';

const TableContainer = (OriginalComponent) => (props) => (
  <div>
    <h1>Yo!</h1>
    <OriginalComponent {...props} />
  </div>
);

export default TableContainer;