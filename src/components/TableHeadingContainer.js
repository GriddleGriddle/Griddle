import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

//import { columnTitlesSelector, columnIdsSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const ComposedContainerComponent = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object,
  }),
  connect((state, props) => ({
    columnTitles: props.selectors.columnTitlesSelector(state),
    columnIds: props.selectors.columnIdsSelector(state),
    className: props.selectors.classNamesForComponentSelector(state, 'TableHeading'),
    style: props.selectors.stylesForComponentSelector(state, 'TableHeading'),
  })),
  mapProps(props => {
    const { components, ...otherProps } = props;
    return {
      TableHeadingCell: components.TableHeadingCell,
      ...otherProps,
    };
  })
)(props => (
  <OriginalComponent {...props} />
));

export default ComposedContainerComponent;
