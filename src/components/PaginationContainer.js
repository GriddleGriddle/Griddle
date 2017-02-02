import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';
import { createStructuredSelector } from 'reselect';

import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const EnhancedPaginationContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
  }),
  connect(
    (state, props) => ({
      className: classNamesForComponentSelector(state, 'Pagination'),
      style: stylesForComponentSelector(state, 'Pagination'),
    })
  ),
  mapProps((props) => {
    const { components, ...otherProps } = props;
    return {
      Next: components.NextButton,
      Previous: components.PreviousButton,
      PageDropdown: components.PageDropdown,
      ...otherProps
    };
  })
)((props) => <OriginalComponent {...props} />);

export default EnhancedPaginationContainer;
