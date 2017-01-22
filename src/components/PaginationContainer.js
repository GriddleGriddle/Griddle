import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';
import { createStructuredSelector } from 'reselect';
import { hasNextSelector, hasPreviousSelector, currentPageSelector, maxPageSelector } from '../selectors/dataSelectors';

const EnhancedPaginationContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
  }),
  mapProps((props) => ({
    Next: props.components.NextButton,
    Previous: props.components.PreviousButton,
    PageDropdown: props.components.PageDropdown,
    ...props
  }))
)((props) => <OriginalComponent {...props} />);

export default EnhancedPaginationContainer;
