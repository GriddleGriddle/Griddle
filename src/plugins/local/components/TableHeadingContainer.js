import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import {
  columnTitlesSelector,
  columnIdsSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/localSelectors';
import GriddleContext from '../../../context/GriddleContext';

const ComposedContainerComponent = (OriginalComponent) =>
  compose(
    connect((state) => ({
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
    // withHandlers({
    //   TableHeadingCell: props => props.components.TableHeadingCell
    // })
  )(({ TableHeadingCell, columnTitles, columnIds, className, style }) => (
    <OriginalComponent
      columnTitles={columnTitles}
      columnIds={columnIds}
      TableHeadingCell={TableHeadingCell}
      className={className}
      style={style}
    />
  ));

export default ComposedContainerComponent;
