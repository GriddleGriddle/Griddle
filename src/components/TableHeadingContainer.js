import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import {
  columnTitlesSelector,
  columnIdsSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

const ComposedContainerComponent = (OriginalComponent) =>
  compose(
    connect((state, props) => ({
      columnTitles: columnTitlesSelector(state),
      columnIds: columnIdsSelector(state),
      className: classNamesForComponentSelector(state, 'TableHeading'),
      style: stylesForComponentSelector(state, 'TableHeading')
    })),
    mapProps((props) => {
      const griddleContext = useContext(GriddleContext);
      return {
        TableHeadingCell: griddleContext.components.TableHeadingCell,
        ...props
      };
    })
  )((props) => <OriginalComponent {...props} />);

export default ComposedContainerComponent;
