import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import { columnTitlesSelector, columnIdsSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/localSelectors';

const ComposedContainerComponent = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  connect((state) => ({
    columnTitles: columnTitlesSelector(state),
    columnIds: columnIdsSelector(state),
    className: classNamesForComponentSelector(state, 'TableHeading'),
    style: stylesForComponentSelector(state, 'TableHeading'),
  })),
  mapProps(props => ({
    TableHeadingCell: props.components.TableHeadingCell,
    ...props
  }))
  // withHandlers({ 
  //   TableHeadingCell: props => props.components.TableHeadingCell
  // })
)(({TableHeadingCell, columnTitles, columnIds, className, style }) => (
  <OriginalComponent
    columnTitles={columnTitles}
    columnIds={columnIds}
    TableHeadingCell={TableHeadingCell}
    className={className}
    style={style}
  />
));

export default ComposedContainerComponent;
