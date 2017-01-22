import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';
import { createStructuredSelector } from 'reselect';

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
)((props) => console.log('PREVIOUS', props.Previous) || <OriginalComponent {...props} />);

export default EnhancedPaginationContainer;
