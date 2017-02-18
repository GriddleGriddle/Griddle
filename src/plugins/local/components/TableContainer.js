import React from 'react';
import { connect } from 'react-redux';

//TODO: adjust the import so we're not pulling in the whole library here'
import { getContext, mapProps, compose } from 'recompose';

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

