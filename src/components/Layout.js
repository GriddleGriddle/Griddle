import React from 'react';

const component = ({Table, Pagination, Filter, SettingsWrapper, className, style}) => (
  <div className={className} style={style}>
    <Filter />
    <SettingsWrapper />
    <Table />
    <Pagination />
  </div>
)

export default component;
