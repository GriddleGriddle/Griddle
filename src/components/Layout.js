import React from 'react';

const component = ({Table, Pagination, Filter, SettingsWrapper}) => (
  <div>
    <Filter />
    <SettingsWrapper />
    <Table />
    <Pagination />
  </div>
)

export default component;
