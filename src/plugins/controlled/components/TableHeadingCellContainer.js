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
      setSortProperties
    };
  })
)((props) => {
  const { setSortProperties, ...otherProps } = props;
  return (
    <OriginalComponent {...otherProps} onClick={setSortProperties} />
  );
});

export default EnhancedHeadingCell;
