import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

//import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const NoResultsContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object
  }),
  connect(
    (state, props) => ({
      className: props.selectors.classNamesForComponentSelector(state, 'NoResults'),
      style: props.selectors.stylesForComponentSelector(state, 'NoResults'),
    })
  ),
  mapProps((props) => {
    const { components, ...otherProps } = props;
    return {
      NoResults: components.NoResults,
      ...otherProps
    };
  })
)((props) => <OriginalComponent {...props} />);

export default NoResultsContainer;

