import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/localSelectors';
import GriddleContext from '../../../context/GriddleContext';

const ComposedTableBodyContainer = (OriginalComponent) =>
  connect((state, props) => {
    return {
      visibleRowIds: props.context.selectors.visibleRowIdsSelector(state),
      className: classNamesForComponentSelector(state, 'TableBody'),
      style: stylesForComponentSelector(state, 'TableBody')
    };
  })((props) => {
    const griddleContext = useContext(GriddleContext);
    const tbodyContainerProps = {
      Row: griddleContext.components.Row,
      visibleRowIdsSelector: griddleContext.selectors.visibleRowIdsSelector,
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
