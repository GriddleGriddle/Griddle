import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { classNamesForComponentSelector, stylesForComponentSelector, visibleRowCountSelector } from '../selectors/dataSelectors';

const ComposedContainerComponent = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object
  }),
  connect(
    (state, props) => ({
      visibleRows: props.selectors.visibleRowCountSelector(state),
      className: props.selectors.classNamesForComponentSelector(state, 'Table'),
      style: props.selectors.stylesForComponentSelector(state, 'Table')
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
