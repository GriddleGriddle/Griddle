import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

//import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const EnhancedPaginationContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object
  }),
  connect(
    (state, props) => ({
      className: props.selectors.classNamesForComponentSelector(state, 'Pagination'),
      style: props.selectors.stylesForComponentSelector(state, 'Pagination'),
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
