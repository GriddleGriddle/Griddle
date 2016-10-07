import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';
import { columnTitlesSelector } from '../selectors/localSelectors';

const ComposedContainerComponent = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  connect((state) => ({
    columnTitles: columnTitlesSelector(state)
  })),
  withHandlers({ 
    TableHeadingCell: props => props.components.TableHeadingCell
  })
)(({TableHeadingCell, columnTitles }) => (
  <OriginalComponent
    columnTitles={columnTitles}
    TableHeadingCell={TableHeadingCell} />
));

export default ComposedContainerComponent;