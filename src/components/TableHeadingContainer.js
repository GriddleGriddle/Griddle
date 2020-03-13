import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  columnTitlesSelector,
  columnIdsSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';

const ComposedContainerComponent = (OriginalComponent) =>
  connect((state, props) => ({
    columnTitles: columnTitlesSelector(state),
    columnIds: columnIdsSelector(state),
    className: classNamesForComponentSelector(state, 'TableHeading'),
    style: stylesForComponentSelector(state, 'TableHeading')
  }))((props) => {
    const tableHeadingProps = {
      ...props,
      TableHeadingCell: props.context.components.TableHeadingCell
    };
    return <OriginalComponent {...tableHeadingProps} />;
  });

export default ComposedContainerComponent;
