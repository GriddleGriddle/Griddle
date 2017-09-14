import React from 'react';

const component = ({Table, Pagination, Filter, SettingsWrapper, Style, className, style}) => (
  <div className={className} style={style}>
    {Style && <Style />}
    <Filter />
    <SettingsWrapper />
    <Table />
    <Pagination />
  </div>
)

export default component;
