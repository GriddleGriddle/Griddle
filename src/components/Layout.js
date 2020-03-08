import React from 'react';

const component = ({ Table, Pagination, Filter, SettingsWrapper, Style }) => (
  <div>
    {Style && <Style />}
    <Filter />
    <SettingsWrapper />
    <Table />
    <Pagination />
  </div>
);

export default component;
