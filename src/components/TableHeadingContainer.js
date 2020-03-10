import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  columnTitlesSelector,
  columnIdsSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

const ComposedContainerComponent = (OriginalComponent) =>
  connect((state, props) => ({
    columnTitles: columnTitlesSelector(state),
    columnIds: columnIdsSelector(state),
    className: classNamesForComponentSelector(state, 'TableHeading'),
    style: stylesForComponentSelector(state, 'TableHeading')
  }))((props) => {
    const griddleContext = useContext(GriddleContext);
    const tableHeadingProps = {
      TableHeadingCell: griddleContext.components.TableHeadingCell,
      ...props
    };
    return <OriginalComponent {...tableHeadingProps} />;
  });

export default ComposedContainerComponent;
