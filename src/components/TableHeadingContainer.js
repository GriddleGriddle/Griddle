import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';
import { columnTitlesSelector, columnIdsSelector } from '../selectors/dataSelectors';

const ComposedContainerComponent = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  connect((state) => ({
    columnTitles: columnTitlesSelector(state),
    columnIds: columnIdsSelector(state)
  })),
  mapProps(props => ({
    TableHeadingCell: props.components.TableHeadingCell,
    ...props
  }))
  // withHandlers({ 
  //   TableHeadingCell: props => props.components.TableHeadingCell
  // })
)(({TableHeadingCell, columnTitles, columnIds }) => (
  <OriginalComponent
    columnTitles={columnTitles}
    columnIds={columnIds}
    TableHeadingCell={TableHeadingCell} />
));

export default ComposedContainerComponent;
