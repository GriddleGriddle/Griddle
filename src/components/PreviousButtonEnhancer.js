import React, { PropTypes } from 'react';
import { compose, mapProps, getContext } from 'recompose';
import { combineHandlers } from '../utils/compositionUtils';

const enhance = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  mapProps(({ events: { onPrevious }, ...props }) => ({
    ...props,
    onClick: combineHandlers([onPrevious, props.onClick]),
  }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
