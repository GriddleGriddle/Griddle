import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose } from 'recompose';

const EnhancedPaginationContainer = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  mapProps(props => {
    const { events: { getNext, getPrevious, setPage }, ...otherProps } = props;
    return {
      ...otherProps,
      getNext,
      getPrevious,
      setPage,
    };
  })
)((props) => {
  const { getNext, getPrevious, setPage, ...otherProps } = props;

  return (
    <OriginalComponent
      {...otherProps}
      getNext={getNext}
      getPrevious={getPrevious}
      setPage={setPage}
    />
  );
});

export default EnhancedPaginationContainer;
