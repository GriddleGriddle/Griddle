import React from 'react';
import { connect } from 'react-redux';

//TODO: adjust the import so we're not pulling in the whole library here'
import { getContext, mapProps, compose } from 'recompose';

import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const ComposedContainerComponent = OriginalComponent => compose(
  getContext(
  {
    components: React.PropTypes.object
  }),
  //TODO: Should we use withHandlers here instead? I realize that's not 100% the intent of that method
  mapProps(props => ({
    TableHeading: props.components.TableHeading,
    TableBody: props.components.TableBody,
  })),
  connect(
    (state, props) => ({
      className: classNamesForComponentSelector(state, 'Table'),
      style: stylesForComponentSelector(state, 'Table'),
    })
  ),
)(props => <OriginalComponent {...props} />);

export default ComposedContainerComponent;
