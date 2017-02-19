import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import { columnIdsSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/localSelectors';

const ComposedRowContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  connect((state) => ({
    columnIds: columnIdsSelector(state),
    className: classNamesForComponentSelector(state, 'Row'),
    style: stylesForComponentSelector(state, 'Row'),
  })),
  mapProps(props => ({
    Cell: props.components.Cell,
    ...props
  })),
)(({Cell, columnIds, griddleKey, style, className }) => (
  <OriginalComponent
    griddleKey={griddleKey}
    columnIds={columnIds}
    Cell={Cell}
    className={className}
    style={style}
  />
));

export default ComposedRowContainer;