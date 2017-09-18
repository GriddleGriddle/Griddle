import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';
import { connect } from '../utils/griddleConnect';

//import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';
import { setFilter } from '../actions';

const EnhancedFilter = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object
  }),
  connect(
    (state, props) => ({
      className: props.selectors.classNamesForComponentSelector(state, 'Filter'),
      style: props.selectors.stylesForComponentSelector(state, 'Filter'),
    }), 
    { setFilter }
  )
)(props => <OriginalComponent {...props} />);

export default EnhancedFilter;
