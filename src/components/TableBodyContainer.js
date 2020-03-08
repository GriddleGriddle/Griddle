import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import {
  visibleRowIdsSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

const ComposedTableBodyContainer = (OriginalComponent) =>
  compose(
    connect((state, props) => ({
      visibleRowIds: visibleRowIdsSelector(state),
      className: classNamesForComponentSelector(state, 'TableBody'),
      style: stylesForComponentSelector(state, 'TableBody')
    })),
    mapProps((props) => {
      const griddleContext = useContext(GriddleContext);
      return {
        Row: griddleContext.components.Row,
        ...props
      };
    })
  )(({ Row, visibleRowIds, style, className }) => (
    <OriginalComponent rowIds={visibleRowIds} Row={Row} style={style} className={className} />
  ));

export default ComposedTableBodyContainer;
