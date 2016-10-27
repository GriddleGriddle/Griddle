import React, { PropTypes } from 'react'
import { compose, mapProps, getContext } from 'recompose';

const EnhancedLayout = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  mapProps( props => ({
    Table: props.components.Table,
    Pagination: props.components.Pagination,
    Filter: props.components.Filter,
    SettingsToggle: props.components.SettingsToggle,
  }))
)(({Table, Pagination, Filter, SettingsToggle}) => (
  <OriginalComponent
    Table={Table}
    Pagination={Pagination}
    Filter={Filter}
    SettingsToggle={SettingsToggle}
  />
));

export default EnhancedLayout;
