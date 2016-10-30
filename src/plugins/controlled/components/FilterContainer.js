import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose } from 'recompose';

const EnhancedFilterContainer = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  mapProps(props => {
    const { events: { setFilter }, ...otherProps } = props;
    return {
      ...otherProps,
      setFilter
    };
  })
)((props) => {
  const { setFilter, ...otherProps } = props;

  return (
    <OriginalComponent
      {...otherProps}
      setFilter={setFilter}
    />
  );
});

export default EnhancedFilterContainer;
