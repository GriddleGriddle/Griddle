import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  visibleRowIdsSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';

const ComposedTableBodyContainer = (OriginalComponent) =>
  connect((state, props) => ({
    visibleRowIds: visibleRowIdsSelector(state),
    className: classNamesForComponentSelector(state, 'TableBody'),
    style: stylesForComponentSelector(state, 'TableBody')
  }))((props) => {
    const tbodyProps = {
      ...props,
      Row: props.context.components.Row
    };
    return (
      <OriginalComponent
        rowIds={tbodyProps.visibleRowIds}
        Row={tbodyProps.Row}
        style={tbodyProps.style}
        className={tbodyProps.className}
      />
    );
  });

export default ComposedTableBodyContainer;
