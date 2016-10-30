import React, { PropTypes } from 'react';

const EnhancedHeadingCell = OriginalComponent => (props, context) => {
  const { setSortProperties } = context.events;
  return (
    <OriginalComponent {...props} onClick={setSortProperties} />
  );
};

EnhancedHeadingCell.contextTypes = {
  events: PropTypes.object
};

export default EnhancedHeadingCell;
