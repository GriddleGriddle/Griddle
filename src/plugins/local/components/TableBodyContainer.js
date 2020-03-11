import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/localSelectors';

const ComposedTableBodyContainer = (OriginalComponent) =>
  connect((state, props) => {
    return {
      visibleRowIds: props.context.selectors.visibleRowIdsSelector(state),
      className: classNamesForComponentSelector(state, 'TableBody'),
      style: stylesForComponentSelector(state, 'TableBody')
    };
  })((props) => {
    const tbodyContainerProps = {
      Row: props.context.components.Row,
      visibleRowIdsSelector: props.context.selectors.visibleRowIdsSelector,
      ...props
    };
    return (
      <OriginalComponent
        rowIds={tbodyContainerProps.visibleRowIds}
        Row={tbodyContainerProps.Row}
        style={tbodyContainerProps.style}
        className={tbodyContainerProps.className}
      />
    );
  });

export default ComposedTableBodyContainer;
