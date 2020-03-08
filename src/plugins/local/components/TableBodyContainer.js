import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/localSelectors';
import GriddleContext from '../../../context/GriddleContext';

const ComposedTableBodyContainer = (OriginalComponent) =>
  compose(
    mapProps((props) => {
      const griddleContext = useContext(GriddleContext);
      return {
        Row: griddleContext.components.Row,
        visibleRowIdsSelector: griddleContext.selectors.visibleRowIdsSelector,
        ...props
      };
    }),
    connect((state, props) => ({
      visibleRowIds: props.visibleRowIdsSelector(state),
      className: classNamesForComponentSelector(state, 'TableBody'),
      style: stylesForComponentSelector(state, 'TableBody')
    }))
    // withHandlers({
    //   Row: props => props.components.Row
    // })
  )(({ Row, visibleRowIds, style, className }) => (
    <OriginalComponent rowIds={visibleRowIds} Row={Row} style={style} className={className} />
  ));

export default ComposedTableBodyContainer;
