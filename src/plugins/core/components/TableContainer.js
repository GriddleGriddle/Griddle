import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { connect } from '../../../utils/griddleConnect';

const ComposedContainerComponent = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object
  }),
  //TODO: Should we use withHandlers here instead? I realize that's not 100% the intent of that method
  connect(
    (state, props) => ({
      dataLoading: props.selectors.dataLoadingSelector(state),
      visibleRows: props.selectors.visibleRowCountSelector(state),
      className: props.selectors.classNamesForComponentSelector(state, 'Table'),
      style: props.selectors.stylesForComponentSelector(state, 'Table'),
    })
  ),
  //TODO: Should we use withHandlers here instead? I realize that's not 100% the intent of that method
  mapProps(props => {
    const { components, dataLoading, visibleRows, className, style } = props;
    return {
      TableHeading: components.TableHeading,
      TableBody: components.TableBody,
      Loading: components.Loading,
      NoResults: components.NoResults,
      dataLoading,
      visibleRows,
      className,
      style
    }
  })
)(props => <OriginalComponent {...props} />);

export default ComposedContainerComponent;
