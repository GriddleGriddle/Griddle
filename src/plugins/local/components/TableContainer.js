import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { classNamesForComponentSelector, stylesForComponentSelector, visibleRowCountSelector } from '../selectors/localSelectors';

const ComposedContainerComponent = OriginalComponent => compose(
  getContext({
    components: React.PropTypes.object
  }),
  mapProps(props => ({
    TableHeading: props.components.TableHeading,
    TableBody: props.components.TableBody,
    NoResults: props.components.NoResults,
  })),
  connect(
    (state, props) => ({
      visibleRows: visibleRowCountSelector(state),
      className: classNamesForComponentSelector(state, 'Table'),
      style: stylesForComponentSelector(state, 'Table'),
    })
  ),
)(props => <OriginalComponent {...props} />);

export default ComposedContainerComponent;

