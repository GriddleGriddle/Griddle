import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';

import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const NoResultsContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
  }),
  connect(
    state => ({
      className: classNamesForComponentSelector(state, 'NoResults'),
      style: stylesForComponentSelector(state, 'NoResults'),
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

