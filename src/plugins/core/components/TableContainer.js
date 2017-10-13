import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { classNamesForComponentSelector, stylesForComponentSelector, dataLoadingSelector, visibleRowCountSelector } from '../selectors/dataSelectors';

const ComposedContainerComponent = OriginalComponent => compose(
  getContext(
  {
    components: PropTypes.object
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
      dataLoading: dataLoadingSelector(state),
      visibleRows: visibleRowCountSelector(state),
      className: classNamesForComponentSelector(state, 'Table'),
      style: stylesForComponentSelector(state, 'Table'),
    })
  ),
)(props => <OriginalComponent {...props} />);

export default ComposedContainerComponent;
