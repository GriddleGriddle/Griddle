import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

const ComposedContainerComponent = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object
  }),
  //TODO: Should we use withHandlers here instead? I realize that's not 100% the intent of that method
  mapProps(props => ({
    TableHeading: props.components.TableHeading,
    TableBody: props.components.TableBody,
    Loading: props.components.Loading,
    NoResults: props.components.NoResults,
  })),
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
    const { components, ...otherProps } = props;
    return {
      TableHeading: components.TableHeading,
      TableBody: components.TableBody,
      NoResults: components.NoResults,
      ...otherProps
    }
  })
)(props => <OriginalComponent {...props} />);

export default ComposedContainerComponent;
