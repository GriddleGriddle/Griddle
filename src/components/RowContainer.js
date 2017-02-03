import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';
import { columnIdsSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const ComposedRowContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
  }),
  connect((state, props) => ({
    columnIds: columnIdsSelector(state),
    className: classNamesForComponentSelector(state, 'Row'),
    style: stylesForComponentSelector(state, 'Row'),
  })),
  mapProps(props => {
    const { components, ...otherProps } = props;
    return {
      Cell: components.Cell,
      ...otherProps
    };
  }),
)(props => (
  <OriginalComponent
    {...props}
  />
));

export default ComposedRowContainer;
