import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import {
  columnTitlesSelector,
  columnIdsSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/localSelectors';
import GriddleContext from '../../../context/GriddleContext';

const ComposedContainerComponent = (OriginalComponent) =>
  connect((state) => ({
    columnTitles: columnTitlesSelector(state),
    columnIds: columnIdsSelector(state),
    className: classNamesForComponentSelector(state, 'TableHeading'),
    style: stylesForComponentSelector(state, 'TableHeading')
  }))((props) => {
    const griddleContext = useContext(GriddleContext);
    const theadContainerProps = {
      TableHeadingCell: griddleContext.components.TableHeadingCell,
      ...props
    };
    return (
      <OriginalComponent
        columnTitles={theadContainerProps.columnTitles}
        columnIds={theadContainerProps.columnIds}
        TableHeadingCell={theadContainerProps.TableHeadingCell}
        className={theadContainerProps.className}
        style={theadContainerProps.style}
      />
    );
  });

export default ComposedContainerComponent;
