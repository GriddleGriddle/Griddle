import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose } from 'recompose';

const EnhancedHeadingCell = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  mapProps(props => {
    const { events: { setSortProperties }, ...otherProps } = props;
    return {
      ...otherProps,
      onClick: setSortProperties
    };
  })
)((props) => {
  return (
    <OriginalComponent {...props} />
  );
});

export default EnhancedHeadingCell;
