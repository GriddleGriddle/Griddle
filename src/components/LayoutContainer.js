import React, { PropTypes } from 'react'
import { compose, mapProps, getContext } from 'recompose';

const EnhancedLayout = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  mapProps( props => ({
    Table: props.components.Table,
    Pagination: props.components.Pagination
  }))
)(({Table, Pagination}) => (
  <OriginalComponent
    Table={Table}
    Pagination={Pagination}
  />
));

export default EnhancedLayout;