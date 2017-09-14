import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import { combineHandlers } from '../utils/compositionUtils';

const EnhancedHeadingCell = OriginalComponent => compose(
  getContext({
    events: PropTypes.object,
  }),
  mapProps(({ events: { onSort }, ...props }) => ({
    ...props,
    onClick: combineHandlers([
      () => onSort && onSort(props.sortProperty || { id: props.columnId }),
      props.onClick,
    ]),
  }))
)(props => <OriginalComponent {...props} />);

export default EnhancedHeadingCell;
