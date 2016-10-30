import React, { PropTypes } from 'react';

const EnhancedPaginationContainer = OriginalComponent => (props, context) => {
  const { getNext, getPrevious, setPage } = context.events;
  return (
    <OriginalComponent
      getNext={getNext}
      getPrevious={getPrevious}
      setPage={setPage}
      {...props}
    />
  );
};

EnhancedPaginationContainer.contextTypes = {
  events: PropTypes.object
};

export default EnhancedPaginationContainer;
