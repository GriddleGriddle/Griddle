import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import {
  columnTitlesSelector,
  columnIdsSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/localSelectors';

const ComposedContainerComponent = (OriginalComponent) =>
  connect((state) => ({
    columnTitles: columnTitlesSelector(state),
    columnIds: columnIdsSelector(state),
    className: classNamesForComponentSelector(state, 'TableHeading'),
    style: stylesForComponentSelector(state, 'TableHeading')
  }))((props) => {
    const theadContainerProps = {
      TableHeadingCell: props.context.components.TableHeadingCell,
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
