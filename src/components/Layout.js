import React from 'react';

const component = ({Table, Pagination, Filter, SettingsToggle}) => (
  <div>
    <Filter />
    <SettingsToggle />
    <Table />
    <Pagination />
  </div>
)

export default component;
